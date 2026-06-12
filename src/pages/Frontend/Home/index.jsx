import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import ScreenLoader from '../../../components/Misc/ScreenLoader';
import { Card, Row, Col, Typography, Button, Badge, Empty } from 'antd';
import { FireFilled, StarFilled, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/Cart.jsx';
import { useFavorites } from '../../../context/FavoriteContext.jsx';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const Home = () => {
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [loading, setLoading] = useState(true);
    const [popularDishes, setPopularDishes] = useState([]);

    useEffect(() => {
        const fetchPopularDishes = async () => {
            try {
                const res = await axios.get(`${window.api}/api/menu/get-menuitems`);
                const menuItems = res.data.menuItems || res.data.menuitems || [];
                const popularItems = menuItems.filter((item) => {
                    const isPopular = item.isPopular === true || item.isPopular === "true" || item.isPopular === 1 || item.isPopular === "1";
                    return isPopular && item.status === 'In Stock';
                });

                setPopularDishes(popularItems);
            } catch (err) {
                console.error("Failed to load popular dishes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularDishes();
    }, []);

    if (loading) return <ScreenLoader />;

    const features = [
        {
            title: 'Quality Food',
            description: 'We use only the freshest and highest quality ingredients in all our dishes.',
            icon: '🍽️',
            color: 'bg-blue-50'
        },
        {
            title: 'Fast Delivery',
            description: 'Your favorite food delivered hot and fresh to your doorstep in no time.',
            icon: '🛵',
            color: 'bg-green-50'
        },
        {
            title: 'Best Chefs',
            description: 'Our award-winning chefs are passionate about creating culinary masterpieces.',
            icon: '👨‍🍳',
            color: 'bg-orange-50'
        }
    ];

    return (
        <div className="bg-white">
            <Hero />

            {/* Features Section */}
            <section className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <Title level={2} className="!text-4xl !font-bold mb-4">Why Choose Us?</Title>
                        <Paragraph className="text-gray-500 text-lg">
                            We take pride in providing an exceptional dining experience that goes beyond just great food.
                        </Paragraph>
                    </div>
                    <Row gutter={[32, 32]}>
                        {features.map((feature, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-2 transition-transform duration-300">
                                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-8`}>
                                        {feature.icon}
                                    </div>
                                    <Title level={4} className="mb-4">{feature.title}</Title>
                                    <Paragraph className="text-gray-500 leading-relaxed mb-0">
                                        {feature.description}
                                    </Paragraph>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* Popular Dishes Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl text-left">
                            <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 uppercase tracking-widest text-sm">
                                <FireFilled /> Hot & Trending
                            </div>
                            <Title level={2} className="!text-4xl !font-bold mb-0">Our Signature Dishes</Title>
                        </div>
                        <Link to="/menu">
                            <Button type="primary" size="large" className="bg-gray-900 hover:bg-black border-none h-14 px-10 rounded-2xl font-bold">
                                View Full Menu
                            </Button>
                        </Link>

                    </div>

                    {popularDishes.length > 0 ? (
                        <Row gutter={[32, 32]}>
                        {popularDishes.slice(0, 4).map((dish) => {
                            const id = dish.itemId || dish._id || dish.id;
                            const name = dish.itemName || dish.name;
                            const image = dish.imageURL || dish.image;
                            const category = dish.itemCategory || dish.category;
                            const price = parseFloat(dish.itemPrice ?? dish.price ?? 0);

                            return (
                            <Col xs={24} sm={12} lg={6} key={id}>
                                <Card
                                    hoverable
                                    className="overflow-hidden rounded-[2rem] border-none shadow-xl shadow-gray-100/50 group"
                                    cover={
                                        <div className="relative overflow-hidden aspect-[4/5]">
                                            <img
                                                alt={name}
                                                src={image}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <Badge count={category} className="site-badge-count-4" style={{ backgroundColor: '#fff', color: '#000', fontWeight: 'bold' }} />
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <Button
                                                    shape="circle"
                                                    icon={<HeartFilled className={isFavorite(id) ? "text-red-500" : "text-gray-300"} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(dish);
                                                    }}
                                                    className="border-none shadow-lg flex items-center justify-center h-10 w-10"
                                                />
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Title level={5} className="!mb-0 group-hover:text-orange-500 transition-colors">{name}</Title>
                                        <div className="flex items-center gap-1 text-orange-500 font-bold">
                                            <StarFilled className="text-xs" /> {dish.rating || '4.8'}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-2xl font-black text-gray-900">${price.toFixed(2)}</span>
                                        <Button
                                            onClick={() => addToCart(dish)}
                                            className="rounded-xl border-gray-200 font-bold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                            );
                        })}
                        </Row>
                    ) : (
                        <Card className="rounded-[2rem] border-none shadow-sm py-12 text-center">
                            <Empty description="No popular dishes available yet" />
                        </Card>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="bg-gray-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px]"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <Title level={2} className="!text-white !text-4xl md:!text-5xl !font-bold mb-6">
                                Join Our EatEase Family & Get <span className="text-orange-500">20% Off</span>
                            </Title>
                            <Paragraph className="!text-white !text-lg mb-10">
                                Subscribe to our newsletter to receive exclusive offers, new dish alerts, and special event invitations.
                            </Paragraph>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    className="bg-orange-500 hover:bg-orange-600 border-none h-14! px-10 rounded-2xl font-bold"
                                >
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
