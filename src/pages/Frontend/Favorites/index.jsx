import React, { useState, useEffect } from 'react';
import ScreenLoader from '../../../components/Misc/ScreenLoader';
import { Typography, Row, Col, Card, Button, Badge, Empty } from 'antd';
import { HeartFilled, ShoppingCartOutlined, StarFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../../context/FavoriteContext';
import { useCart } from '../../../context/Cart';

const { Title, Text, Paragraph } = Typography;

const Favorites = () => {
    const [loading, setLoading] = useState(true);
    const { favorites, removeFromFavorites } = useFavorites();
    const { addToCart } = useCart();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

    const handleRemove = (id) => {
        removeFromFavorites(id);
    };

    if (loading) return <ScreenLoader />;

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-12">
                    <Link to="/menu">
                        <Button shape="circle" icon={<ArrowLeftOutlined />} className="h-10 w-10 sm:h-12 sm:w-12 border-none shadow-sm flex items-center justify-center bg-white" />
                    </Link>
                    <div>
                        <Title level={2} className="!mb-0.5 !font-bold text-2xl sm:text-3xl">Your Favorites</Title>
                        <Text className="text-gray-500 text-xs sm:text-sm">Quickly access the dishes you love most.</Text>
                    </div>
                </div>

                {favorites.length > 0 ? (
                    /* Balanced gutters for mobile grid spacing */
                    <Row gutter={[12, 12]}>
                        {favorites.map((dish) => {
                            const id = dish.itemId || dish.id || dish._id;
                            const name = dish.itemName || dish.name;
                            const image = dish.imageURL || dish.image;
                            const category = dish.itemCategory || dish.category;
                            const price = parseFloat(dish.itemPrice ?? dish.price ?? 0);

                            return (
                                /* Strict 2 items per line on mobile (xs={12}) to prevent long cards */
                                <Col xs={12} sm={12} md={8} lg={6} key={id} className="flex">
                                    <Card
                                        hoverable
                                        className="overflow-hidden rounded-2xl sm:rounded-[2rem] border-none shadow-md shadow-gray-100/50 group bg-white w-full flex flex-col justify-between"
                                        styles={{
                                            body: {
                                                padding: '8px sm:padding-16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                flex: 1,
                                                justify: 'space-between'
                                            }
                                        }}
                                    >
                                        {/* Fixed Ratio Aspect-Square Image Box */}
                                        <div className="relative overflow-hidden aspect-square rounded-xl sm:rounded-[1.5rem] w-full bg-gray-50 flex-shrink-0">
                                            <img
                                                alt={name}
                                                src={image}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Remove from favorites Action Button */}
                                            <div className="absolute top-2 right-2 z-10 sm:top-3 sm:right-3">
                                                <Button
                                                    shape="circle"
                                                    icon={<HeartFilled className="text-red-500" />}
                                                    onClick={() => handleRemove(id)}
                                                    className="border-none shadow-sm h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center bg-white!"
                                                />
                                            </div>

                                            {/* Category Overlay Tag */}
                                            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[90%] sm:bottom-3 sm:left-3">
                                                <span className="bg-white/90 backdrop-blur-md text-black font-bold px-1.5 py-0.5 rounded sm:px-2 sm:rounded-md text-[8px] sm:text-[9px] uppercase tracking-wider m-0 border-none shadow-xs">
                                                    {category || 'EatEase'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Elements Box */}
                                        <div className="pt-2 sm:pt-3 text-left flex flex-col flex-1 justify-between">
                                            <div>
                                                {/* Line-clamp prevents multiple lines from blowing up the card height */}
                                                <h4 className="text-gray-900 font-bold text-sm sm:text-base md:text-lg mb-0.5 line-clamp-1 text-left">
                                                    {name}
                                                </h4>
                                                <div className="flex items-center gap-1 text-orange-500 font-bold text-[10px] sm:text-xs mb-2">
                                                    <StarFilled className="text-[9px] sm:text-xs" /> {dish.rating || '4.8'}
                                                </div>
                                            </div>

                                            {/* Price point & Cart Controller Row */}
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                                                <span className="text-base font-black text-gray-900 sm:text-lg md:text-xl">
                                                    ${price.toFixed(2)}
                                                </span>
                                                <Button
                                                    icon={<ShoppingCartOutlined />}
                                                    onClick={() => addToCart(dish)}
                                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gray-900 text-white border-none flex items-center justify-center hover:bg-orange-500 hover:scale-105 transition-all text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <Card className="rounded-[2rem] sm:rounded-[3rem] border-none shadow-sm py-16 sm:py-24 text-center">
                        <Empty
                            description={<Text className="text-lg sm:text-xl text-gray-400">No favorite dishes yet</Text>}
                            image={<HeartFilled className="text-6xl sm:text-8xl text-red-50" />}
                        />
                        <Link to="/menu" className="mt-6 sm:mt-8 inline-block">
                            <Button type="primary" size="large" className="bg-orange-500 border-none h-12 sm:h-14 px-8 sm:px-10 rounded-2xl font-bold text-sm sm:text-base">
                                Find Dishes You Love
                            </Button>
                        </Link>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Favorites;