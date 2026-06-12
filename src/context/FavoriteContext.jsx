import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

const getUserIdFromToken = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        return decoded.uid;
    } catch {
        return null;
    }
};

const getFavoriteKey = (uid) => {
    return uid ? `favorites_${uid}` : 'favorites_guest';
};

export const FavoriteProvider = ({ children }) => {
    const { user } = useAuth();
    const uid = user?.uid || user?._id || user?.id;

    const [favorites, setFavorites] = useState(() => {
        const initialUid = getUserIdFromToken();
        const savedFavorites = localStorage.getItem(getFavoriteKey(initialUid));
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        const savedFavorites = localStorage.getItem(getFavoriteKey(uid));
        setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
    }, [uid]);

    useEffect(() => {
        localStorage.setItem(getFavoriteKey(uid), JSON.stringify(favorites));
    }, [favorites, uid]);

    const addToFavorites = (product) => {
        const id = product.itemId || product.id || product._id;
        const itemName = product.itemName || product.name;

        if (!favorites.some(item => (item.itemId || item.id || item._id) === id)) {
            setFavorites(prev => [...prev, { ...product, itemId: id, itemName }]);
            toast.success(`"${itemName}" Added to Wishlist`, {
                style: {
                    backgroundColor: '#f97316',
                    color: '#fff',
                    borderRadius: '16px',
                    fontWeight: 'bold'
                }
            });
        }
    };

    const removeFromFavorites = (id) => {
        const product = favorites.find(item => (item.itemId || item.id || item._id) === id);
        const itemName = product ? (product.itemName || product.name) : "Item";

        setFavorites(prev => prev.filter(item => (item.itemId || item.id || item._id) !== id));

        if (product) {
            toast.info(`"${itemName}" Removed from Wishlist`, {
                style: {
                    backgroundColor: '#111827',
                    color: '#fff',
                    borderRadius: '16px',
                    fontWeight: 'bold'
                }
            });
        }
    };

    const isFavorite = (id) => {
        return favorites.some(item => (item.itemId || item.id || item._id) === id);
    };

    const toggleFavorite = (product) => {
        const id = product.itemId || product.id || product._id;

        if (isFavorite(id)) {
            removeFromFavorites(id);
        } else {
            addToFavorites(product);
        }
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoriteContext);
