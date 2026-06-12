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
        <div className="bg-gray-50 min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex items-center gap-4 mb-12">
                    <Link to="/menu">
                        <Button shape="circle" icon={<ArrowLeftOutlined />} className="h-12 w-12 border-none shadow-sm flex items-center justify-center bg-white" />
                    </Link>
                    <div>
                        <Title level={2} className="!mb-1 !font-bold">Your Favorites</Title>
                        <Text className="text-gray-500">Quickly access the dishes you love most.</Text>
                    </div>
                </div>

                {favorites.length > 0 ? (
                    <Row gutter={[32, 32]}>
                        {favorites.map((dish) => {
                            const id = dish.itemId || dish.id || dish._id;
                            const name = dish.itemName || dish.name;
                            const image = dish.imageURL || dish.image;
                            const category = dish.itemCategory || dish.category;
                            const price = parseFloat(dish.itemPrice ?? dish.price ?? 0);

                            return (
                            <Col xs={24} sm={12} lg={6} key={id}>
                                <Card
                                    hoverable
                                    className="overflow-hidden rounded-[2.5rem] border-none shadow-xl shadow-gray-100/50 group bg-white"
                                    cover={
                                        <div className="relative overflow-hidden aspect-[4/5]">
                                            <img
                                                alt={name}
                                                src={image}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-5 right-5">
                                                <Button 
                                                    shape="circle" 
                                                    icon={<HeartFilled className="text-red-500" />} 
                                                    onClick={() => handleRemove(id)}
                                                    className="border-none shadow-lg h-10 w-10 flex items-center justify-center bg-white" 
                                                />
                                            </div>
                                            <div className="absolute top-5 left-5">
                                                <Badge count={category} style={{ backgroundColor: '#fff', color: '#000', fontWeight: 'bold' }} />
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Title level={4} className="!mb-0 !text-xl group-hover:text-orange-500 transition-colors truncate">{name}</Title>
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-500 font-bold mb-4">
                                        <StarFilled className="text-xs" /> {dish.rating}
                                    </div>
                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                                        <span className="text-2xl font-black text-gray-900">${price.toFixed(2)}</span>
                                        <Button 
                                            icon={<ShoppingCartOutlined />}
                                            onClick={() => addToCart(dish)}
                                            className="h-14 w-14 rounded-2xl bg-gray-900 text-white border-none flex items-center justify-center hover:bg-orange-500 hover:scale-110 transition-all shadow-lg"
                                        />
                                    </div>
                                </Card>
                            </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <Card className="rounded-[3rem] border-none shadow-sm py-24 text-center">
                        <Empty 
                            description={<Text className="text-xl text-gray-400">No favorite dishes yet</Text>}
                            image={<HeartFilled className="text-8xl text-red-50" />}
                        />
                        <Link to="/menu" className="mt-8 inline-block">
                            <Button type="primary" size="large" className="bg-orange-500 border-none h-14 px-10 rounded-2xl font-bold">
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
