import { createContext, useContext, useState } from "react";
const CartContext = createContext();
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 0) + (product.quantity || 1) }
            : p
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };
  const updateQuantity = (id, qty) => {
    const nextQty = Math.max(1, Number(qty) || 1);
    setCartItems(prev =>
      prev.map(p => (p.id === id ? { ...p, quantity: nextQty } : p))
    );
  };
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(p => p.id !== id));
  };
  const clearCart = () => setCartItems([]);
  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCartContext = () => useContext(CartContext);