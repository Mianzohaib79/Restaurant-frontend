import React, { useState, useEffect } from 'react';
import ScreenLoader from '../../../components/Misc/ScreenLoader';
import { Typography, Row, Col, Card, Button, Input, Tag } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, StarFilled, HeartFilled } from '@ant-design/icons';
import axios from 'axios';
import { useCart } from '../../../context/Cart';
import { useFavorites } from '../../../context/FavoriteContext';

const { Title, Paragraph } = Typography;

const Menu = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Context hooks for Cart and Favorites/Wishlist
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    // Fetch dynamic menu data from APIs
    useEffect(() => {
        const fetchMenuData = async () => {
            setIsLoading(true);
            try {
                const [menuRes, categoryRes] = await Promise.all([
                    axios.get(`${window.api}/api/menu/get-menuitems`),
                    axios.get(`${window.api}/api/categories/get-categories`)
                ]);

                if (menuRes.status === 200) {
                    setMenuItems(menuRes.data.menuItems || menuRes.data.menuitems || []);
                }
                if (categoryRes.status === 200) {
                    setCategories(categoryRes.data.categories || []);
                }
            } catch (err) {
                console.error("Failed to load menu data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    // Helper to get category icons dynamically based on name
    const getCategoryIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('starter') || lowerName.includes('appetizer')) return '🥗';
        if (lowerName.includes('main') || lowerName.includes('course') || lowerName.includes('pizza') || lowerName.includes('burger')) return '🍝';
        if (lowerName.includes('seafood') || lowerName.includes('fish')) return '🦐';
        if (lowerName.includes('drink') || lowerName.includes('beverage')) return '🍹';
        if (lowerName.includes('dessert') || lowerName.includes('sweet') || lowerName.includes('cake')) return '🍰';
        return '🍽️';
    };

    if (isLoading) return <ScreenLoader />;

    // Combine category selection and search query filtering
    const filteredItems = menuItems.filter(item => {
        // Only display items that are available (In Stock)
        if (item.status !== 'In Stock') return false;

        const matchesCategory = activeCategory === 'All' || item.itemCategory === activeCategory;
        const matchesSearch = (item.itemName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.itemCategory || "").toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-bold text-sm mb-4">
                        Discover Our Menu
                    </div>
                    <Title className="!text-5xl !font-bold mb-6">Experience True <span className="text-orange-500">Gastronomy</span></Title>
                    <Paragraph className="text-gray-500 text-lg">
                        Explore our curated selection of fine dishes, where each plate tells a story of tradition, innovation, and passion.
                    </Paragraph>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12 bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                    <div className="w-full lg:w-auto">
                        <Input
                            prefix={<SearchOutlined className="text-gray-400" />}
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 rounded-2xl border-none shadow-sm text-lg w-full lg:w-80"
                            allowClear
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
                        <Button
                            onClick={() => setActiveCategory('All')}
                            className={`h-12 px-6 rounded-xl font-bold border-none transition-all ${activeCategory === 'All'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                                }`}
                        >
                            <span className="mr-2">🍽️</span> All Items
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id || cat._id}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`h-12 px-6 rounded-xl font-bold border-none transition-all ${activeCategory === cat.name
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                    : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                                    }`}
                            >
                                <span className="mr-2">{getCategoryIcon(cat.name)}</span> {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid */}
                <Row gutter={[32, 32]}>
                    {filteredItems.map((item) => (
                        <Col xs={24} sm={12} lg={6} key={item.itemId || item._id}>
                            <Card
                                hoverable
                                className="overflow-hidden rounded-[2.5rem] border-none shadow-xl shadow-gray-100/50 group bg-white"
                                cover={
                                    <div className="relative overflow-hidden aspect-[4/5]">
                                        <img
                                            alt={item.itemName}
                                            src={item.imageURL}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-5 right-5 font-bold z-10">
                                            <Button 
                                                shape="circle" 
                                                icon={<HeartFilled className={isFavorite(item.itemId || item._id) ? "text-red-500" : "text-gray-200 hover:text-red-500 transition-colors"} />} 
                                                className="border-none shadow-lg h-10 w-10 flex items-center justify-center bg-white!" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(item);
                                                }}
                                            />
                                        </div>
                                        <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                                            {item.isPopular && (
                                                <Tag className="border-none bg-orange-500 text-white font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider">
                                                    Popular
                                                </Tag>
                                            )}
                                            <Tag className="border-none bg-white/90 backdrop-blur-md text-black font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider">
                                                {item.itemCategory}
                                            </Tag>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="p-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <Title level={4} className="!mb-0 !text-xl group-hover:text-orange-500 transition-colors truncate">
                                            {item.itemName}
                                        </Title>
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-500 font-bold mb-4">
                                        <StarFilled className="text-xs" /> {item.rating || '4.8'} <span className="text-gray-300 font-normal ml-1">| 50+ reviews</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                                        <span className="text-3xl font-black text-gray-900">${parseFloat(item.itemPrice || 0).toFixed(2)}</span>
                                        <Button
                                            icon={<ShoppingCartOutlined />}
                                            className="h-14 w-14 rounded-2xl bg-gray-900 text-white border-none flex items-center justify-center hover:bg-orange-500 hover:scale-110 transition-all shadow-lg"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item);
                                            }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {filteredItems.length === 0 && (
                    <div className="text-center py-24">
                        <Title level={3} className="text-gray-300">No items found in this category</Title>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;