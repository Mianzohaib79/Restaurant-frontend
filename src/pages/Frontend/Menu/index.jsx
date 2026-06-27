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

    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

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

    const filteredItems = menuItems.filter(item => {
        if (item.status !== 'In Stock') return false;

        const matchesCategory = activeCategory === 'All' || item.itemCategory === activeCategory;
        const matchesSearch = (item.itemName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.itemCategory || "").toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <div className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-bold text-sm mb-4">
                        Discover Our Menu
                    </div>
                    <Title className="text-3xl! sm:text-5xl! font-bold! mb-6">Experience True <span className="text-orange-500">Gastronomy</span></Title>
                    <Paragraph className="text-gray-500 text-base sm:text-lg">
                        Explore our curated selection of fine dishes, where each plate tells a story of tradition, innovation, and passion.
                    </Paragraph>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6 mb-12 bg-gray-50 p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100">
                    <div className="w-full lg:w-auto">
                        <Input
                            prefix={<SearchOutlined className="text-gray-400" />}
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 sm:h-14 rounded-2xl border-none shadow-sm text-base sm:text-lg w-full lg:w-80"
                            allowClear
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
                        <Button
                            onClick={() => setActiveCategory('All')}
                            className={`h-10 sm:h-12 px-4 sm:px-6 rounded-xl font-bold border-none transition-all text-xs sm:text-sm ${activeCategory === 'All'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                                }`}
                        >
                            <span className="mr-1 sm:mr-2">🍽️</span> All Items
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id || cat._id}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`h-10 sm:h-12 px-4 sm:px-6 rounded-xl font-bold border-none transition-all text-xs sm:text-sm ${activeCategory === cat.name
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                    : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                                    }`}
                            >
                                <span className="mr-1 sm:mr-2">{getCategoryIcon(cat.name)}</span> {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid: Balanced gutters for mobile and desktop */}
                <Row gutter={[12, 12]}>
                    {filteredItems.map((item) => (
                        <Col xs={12} sm={12} md={8} lg={6} key={item.itemId || item._id} className="flex">
                            <Card
                                hoverable
                                className="overflow-hidden rounded-2xl sm:rounded-[2rem] border-none shadow-md shadow-gray-100/50 group bg-white w-full flex flex-col justify-between"
                                styles={{ body: { padding: '8px sm:padding-16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' } }}
                            >
                                {/* Fixed Ratio Compact Image Wrapper */}
                                <div className="relative overflow-hidden aspect-square rounded-xl sm:rounded-[1.5rem] w-full bg-gray-50 flex-shrink-0">
                                    <img
                                        alt={item.itemName}
                                        src={item.imageURL}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Favorite Action Button */}
                                    <div className="absolute top-2 right-2 z-10 sm:top-3 sm:right-3">
                                        <Button
                                            shape="circle"
                                            icon={<HeartFilled className={isFavorite(item.itemId || item._id) ? "text-red-500" : "text-gray-200 hover:text-red-500 transition-colors"} />}
                                            className="border-none shadow-sm h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center bg-white!"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(item);
                                            }}
                                        />
                                    </div>
                                    {/* Responsive Badges */}
                                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[90%] sm:bottom-3 sm:left-3">
                                        {item.isPopular && (
                                            <Tag className="border-none bg-orange-500 text-white font-bold px-1.5 py-0.5 rounded sm:px-2 sm:rounded-md text-[8px] sm:text-[9px] uppercase tracking-wider m-0">
                                                Popular
                                            </Tag>
                                        )}
                                    </div>
                                </div>

                                {/* Content Elements Box */}
                                <div className="pt-2 sm:pt-3 text-left flex flex-col flex-1 justify-between">
                                    <div>
                                        <h4 className="text-gray-900 font-bold text-sm sm:text-base md:text-lg mb-0.5 line-clamp-1 text-left">
                                            {item.itemName}
                                        </h4>
                                        <span className="text-gray-400 text-[10px] sm:text-xs block text-left mb-1.5 sm:mb-2 truncate">
                                            {item.itemCategory}
                                        </span>
                                        <div className="flex items-center gap-1 text-orange-500 font-bold text-[10px] sm:text-xs mb-2">
                                            <StarFilled className="text-[9px] sm:text-xs" /> {item.rating || '4.8'}
                                        </div>
                                    </div>

                                    {/* Price point & Cart Controller Row */}
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                                        <span className="text-base font-black text-gray-900 sm:text-lg md:text-xl">
                                            ${parseFloat(item.itemPrice || 0).toFixed(2)}
                                        </span>
                                        <Button
                                            icon={<ShoppingCartOutlined />}
                                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gray-900 text-white border-none flex items-center justify-center hover:bg-orange-500 hover:scale-105 transition-all text-sm sm:text-base"
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