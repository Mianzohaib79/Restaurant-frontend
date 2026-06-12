import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Home from './Home';
import About from './About';
import Menu from './Menu';
import Reservations from './Reservations';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import Profile from './Profile';
import Favorites from './Favorites';

const Frontend = () => {
    return (
        <>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/menu/*" element={<Menu />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </main>
            <Footer />
        </>
    )
}

export default Frontend