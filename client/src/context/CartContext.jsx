import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sree_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('sree_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity));
    const availableStock = product.stockQuantity !== undefined ? product.stockQuantity : 10;

    if (availableStock <= 0) {
      showNotification(`"${product.name}" is currently out of stock.`);
      return false;
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.productId || item._id === product._id
      );

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = Math.min(currentQty + qty, availableStock);

        if (newQty === currentQty && currentQty >= availableStock) {
          showNotification(`Maximum available stock (${availableStock}) reached for this saree.`);
          return prevItems;
        }

        const updated = [...prevItems];
        const verifiedPrice = product.discountPrice || product.price;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: verifiedPrice * newQty,
          availableStock
        };
        showNotification(`Updated quantity to ${newQty} in your cart.`);
        return updated;
      } else {
        const verifiedPrice = product.discountPrice || product.price;
        const finalQty = Math.min(qty, availableStock);
        const newItem = {
          _id: product._id,
          productId: product.productId,
          name: product.name,
          price: verifiedPrice,
          originalPrice: product.price,
          quantity: finalQty,
          availableStock,
          image: product.images && product.images[0] ? product.images[0] : '',
          fabric: product.fabric,
          colour: product.colour,
          category: product.category,
          subtotal: verifiedPrice * finalQty
        };
        showNotification(`Added "${product.name}" to cart.`);
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = Number(newQuantity);

    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId || item._id === productId) {
          const finalQty = Math.min(qty, item.availableStock || 99);
          return {
            ...item,
            quantity: finalQty,
            subtotal: item.price * finalQty
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId && item._id !== productId)
    );
    showNotification('Item removed from cart.');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('sree_cart');
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryCharge = subtotal >= 5000 ? 0 : (subtotal > 0 ? 150 : 0);
  const finalTotal = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        deliveryCharge,
        finalTotal,
        notification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
