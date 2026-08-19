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
