import React, { createContext, useContext, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  subTotal: number;
  expressFee: number;
  total: number;
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateQuantityOrAdd: (item: Omit<CartItem, 'qty'>, delta: number) => void;
  setExpressFee: (fee: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [expressFee, setExpressFee] = useState<number>(0);

  const addItem = (newItem: Omit<CartItem, 'qty'>) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => item.id === newItem.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...newItem, qty: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          return { ...item, qty: Math.max(0, item.qty + delta) };
        }
        return item;
      }).filter(item => item.qty > 0);
    });
  };
  
  const updateQuantityOrAdd = (item: Omit<CartItem, 'qty'>, delta: number) => {
      setItems(prev => {
          const existing = prev.find(i => i.id === item.id);
          if (existing) {
              return prev.map(i => i.id === item.id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0);
          } else if (delta > 0) {
              return [...prev, { ...item, qty: delta }];
          }
          return prev;
      });
  }

  const getItemQuantity = (id: string) => {
    const item = items.find(i => i.id === id);
    return item ? item.qty : 0;
  };

  const clearCart = () => {
    setItems([]);
    setExpressFee(0);
  };

  const subTotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const pickupDeliveryFee = subTotal > 0 ? 40 : 0; // standard fee
  const total = subTotal > 0 ? subTotal + pickupDeliveryFee + expressFee : 0;

  return (
    <CartContext.Provider value={{
      items,
      subTotal,
      expressFee,
      total,
      addItem,
      removeItem,
      updateQuantity,
      updateQuantityOrAdd,
      setExpressFee,
      clearCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
