import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Helper to decode uid from JWT token immediately
const getUserIdFromToken = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        return decoded.uid;
    } catch (e) {
        return null;
    }
};

const getCartKey = (uid) => {
    return uid ? `cart_${uid}` : 'cart_guest';
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const uid = user?.uid || user?._id || user?.id;

    // Initialize cart items directly from localStorage scoped by initial token
    const [cartItems, setCartItems] = useState(() => {
        const initialUid = getUserIdFromToken();
        const savedCart = localStorage.getItem(getCartKey(initialUid));
        const items = savedCart ? JSON.parse(savedCart) : [];
        return items.map(item => ({
            ...item,
            itemPrice: typeof item.itemPrice === 'string' ? parseFloat(item.itemPrice) : (item.itemPrice || item.price || 0)
        }));
    });

    // Synchronize cart state when active user changes (e.g. login/logout)
    useEffect(() => {
        const key = getCartKey(uid);
        const savedCart = localStorage.getItem(key);
        const items = savedCart ? JSON.parse(savedCart) : [];
        setCartItems(items.map(item => ({
            ...item,
            itemPrice: typeof item.itemPrice === 'string' ? parseFloat(item.itemPrice) : (item.itemPrice || item.price || 0)
        })));
    }, [uid]);

    // Save cart state changes to localStorage
    useEffect(() => {
        const key = getCartKey(uid);
        localStorage.setItem(key, JSON.stringify(cartItems));
    }, [cartItems, uid]);

    const addToCart = (product) => {
        const id = product.itemId || product.id || product._id;
        const itemName = product.itemName || product.name;
        const itemPrice = product.itemPrice ?? product.price ?? 0;

        const existingItem = cartItems.find(item => (item.itemId || item.id || item._id) === id);
        const price = typeof itemPrice === 'string' ? parseFloat(itemPrice) : itemPrice;

        if (existingItem) {
            setCartItems(prev => prev.map(item =>
                (item.itemId || item.id || item._id) === id ? { ...item, quantity: item.quantity + 1 } : item
            ));
            toast.success(`Updated "${itemName}" quantity in cart 🛒`, {
                style: { backgroundColor: '#f97316', color: '#fff', borderRadius: '16px', fontWeight: 'bold' }
            });
        } else {
            setCartItems(prev => [...prev, { ...product, itemId: id, itemName, itemPrice: price, quantity: 1 }]);
            toast.success(`"${itemName}" added to cart 🛒`, {
                style: { backgroundColor: '#f97316', color: '#fff', borderRadius: '16px', fontWeight: 'bold' }
            });
        }
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => (item.itemId || item.id || item._id) !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item => (item.itemId || item.id || item._id) === id ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.length;
    const subtotal = cartItems.reduce((total, item) => {
        const price = typeof item.itemPrice === 'string' ? parseFloat(item.itemPrice) : (item.itemPrice || item.price || 0);
        return total + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
