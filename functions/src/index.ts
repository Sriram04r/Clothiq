import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const onOrderUpdated = functions.firestore
  .document("users/{userId}/orders/{orderId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const userId = context.params.userId;

    // Only send notification if status specifically changed to 'delivered'
    if (beforeData.status !== "delivered" && afterData.status === "delivered") {
      try {
        const userDoc = await admin.firestore().collection("users").doc(userId).get();
        if (!userDoc.exists) return;

        const userData = userDoc.data();
        const pushToken = userData?.pushToken;

        if (pushToken) {
          const message = {
            to: pushToken,
            sound: "default",
            title: "Order Delivered! 🎉",
            body: "Your laundry has arrived! Thank you for choosing Clothiq.",
            data: { orderId: context.params.orderId },
          };

          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          });

          functions.logger.info(`Successfully sent push notification to ${userId}`);
        }
      } catch (error) {
        functions.logger.error("Error sending push notification", error);
      }
    }
  });

export const autoAssignDriver = functions.firestore
  .document("users/{userId}/orders/{orderId}")
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    
    // Check if the order already has a driver assigned manually somehow
    if (orderData.driverId) {
      functions.logger.info("Order already has a driver assigned. Skipping auto-assign.");
      return;
    }

    try {
      // 1. Fetch all active drivers
      const driversSnapshot = await admin.firestore().collection("users").where("role", "==", "driver").get();
      
      if (driversSnapshot.empty) {
        functions.logger.warn("No drivers found in the system to assign to the order.");
        return;
      }

      const drivers = driversSnapshot.docs;
      
      let bestDriverId: string | null = null;
      let minActiveOrders = Infinity;

      // 2. Count active orders for each driver
      for (const driverDoc of drivers) {
        const driverId = driverDoc.id;
        
        // Find all active orders assigned to this driver
        const activeOrdersQuery = await admin.firestore().collectionGroup("orders")
          .where("driverId", "==", driverId)
          .where("status", "in", ["placed_cod", "pickup_ready", "out_for_pickup", "washing", "delivery_ready", "out_for_delivery"])
          .get();
        
        const activeCount = activeOrdersQuery.size;
        
        if (activeCount < minActiveOrders) {
          minActiveOrders = activeCount;
          bestDriverId = driverId;
        }
      }

      // 3. Assign the order to the best driver
      if (bestDriverId) {
        await snap.ref.update({
          driverId: bestDriverId
        });
        
        functions.logger.info(`Successfully assigned order ${context.params.orderId} to driver ${bestDriverId} (Active load: ${minActiveOrders})`);
      }
    } catch (error) {
      functions.logger.error("Error auto-assigning driver", error);
    }
  });
