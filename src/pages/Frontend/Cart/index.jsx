import React, { useState, useEffect } from 'react';
import ScreenLoader from '../../../components/Misc/ScreenLoader';
import { Typography, Row, Col, Card, Button, InputNumber, Divider, Empty, Input } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined, CreditCardOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useCart } from '../../../context/Cart.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import axios from 'axios';

const { Title, Text } = Typography;

const Cart = () => {
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
    const { user, isAuth } = useAuth();
    const [customer, setCustomer] = useState({ fullName: '', phoneNumber: '', address: '', });

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

    useEffect(() => {
        setCustomer({
            fullName: user?.fullName || user?.name || '',
            phoneNumber: user?.phoneNumber || user?.phone || '',
            address: user?.address || '',
        });
    }, [user]);

    const removeItem = (id) => {
        removeFromCart(id);
    };

    const handleCustomerChange = (field, value) => {
        setCustomer(prev => ({ ...prev, [field]: value }));
    };

    const tax = subtotal * 0.1;
    const total = subtotal + tax + (cartItems.length > 0 ? 5.00 : 0); // $5 delivery if cart not empty
    const totalItems = cartItems.length;

    const handleConfirmOrder = async () => {
        if (!isAuth) {
            window.toastify("Please login before placing order", "error");
            return;
        }

        if (!customer.fullName || !customer.phoneNumber || !customer.address) {
            window.toastify("Please fill customer details", "error");
            return;
        }

        const items = cartItems.map((item) => ({
            menuItemId: item._id,
            itemId: item.itemId || item.id || item._id,
            quantity: item.quantity,
        }));

        setOrderLoading(true);
        try {
            const res = await axios.post(`${window.api}/api/orders/create-order`, {
                items,
                totalItems,
                totalAmount: total,
                fullName: customer.fullName,
                phoneNumber: customer.phoneNumber,
                address: customer.address,
                paymentMethod: 'Cash on Delivery',
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            });

            if (res.status === 201) {
                window.toastify("Order placed successfully", "success");
                clearCart();
            }
        } catch (err) {
            console.error("Order failed:", err);
            window.toastify(err?.response?.data?.message || "Failed to place order", "error");
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) return <ScreenLoader />;

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex items-center gap-4 mb-10">
                    <Link to="/menu">
                        <Button shape="circle" icon={<ArrowLeftOutlined />} className="h-12 w-12 border-none shadow-sm flex items-center justify-center bg-white" />
                    </Link>
                    <Title level={2} className="mb-0! font-bold!">Shopping Cart</Title>
                </div>

                {cartItems.length > 0 ? (
                    <Row gutter={[32, 32]}>
                        <Col xs={24} lg={16}>
                            <div className="space-y-4">
                                {cartItems.map((item) => {
                                    const id = item.itemId || item.id || item._id;
                                    const name = item.itemName || item.name;
                                    const image = item.imageURL || item.image;
                                    const price = typeof item.itemPrice === 'string' ? parseFloat(item.itemPrice) : (item.itemPrice || item.price || 0);
                                    const itemTotal = price * item.quantity;

                                    return (
                                        <Card key={id} className="rounded-3xl border-none shadow-sm overflow-hidden mb-4! bg-white p-2 sm:p-0">
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
                                                {/* Mobile Responsive Image Container */}
                                                <div className="w-full sm:w-32 h-44 sm:h-32 rounded-2xl overflow-hidden shrink-0">
                                                    <img src={image} alt={name} className="w-full h-full object-cover" />
                                                </div>

                                                {/* Details & Info Container */}
                                                <div className="w-full flex-1 flex flex-col justify-between text-left px-2 sm:px-0 sm:pt-2">
                                                    <div>
                                                        <Title level={4} className="mb-1! text-lg md:text-xl font-bold">{name}</Title>
                                                        <Text className="text-gray-400 text-xs md:text-sm">{item.itemCategory || item.category || 'EatEase Selection'}</Text>
                                                    </div>

                                                    {/* Price, Totals and Inputs layout fixed for Mobile */}
                                                    <div className="mt-4 flex flex-row items-end justify-between gap-2 w-full pt-3 border-t border-gray-100 sm:border-none">
                                                        <div className="flex flex-col">
                                                            <Text className="text-xl font-black text-orange-500">${price.toFixed(2)}</Text>
                                                            <Text className="text-gray-400 text-xs">Total: ${itemTotal.toFixed(2)}</Text>
                                                        </div>

                                                        {/* Quantity & Delete Actions */}
                                                        <div className="flex items-center gap-2 sm:gap-4">
                                                            <InputNumber
                                                                min={1}
                                                                max={10}
                                                                value={item.quantity}
                                                                onChange={(val) => updateQuantity(id, val || 1)}
                                                                className="rounded-xl border-gray-100 h-9 sm:h-10 w-16 sm:w-20 flex items-center text-sm"
                                                            />
                                                            <Button
                                                                type="text"
                                                                danger
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => removeItem(id)}
                                                                className="hover:bg-red-50 rounded-xl h-9 sm:h-10 w-9 sm:w-10 flex items-center justify-center text-base"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </Col>

                        <Col xs={24} lg={8}>
                            <div className="space-y-6 sticky top-28">
                                <Card className="rounded-[2rem] border-none shadow-sm bg-white mb-6!">
                                    <Title level={4} className="font-bold! mb-5!">Customer Details</Title>
                                    <div className="space-y-4">
                                        <Input
                                            prefix={<UserOutlined className="text-orange-500" />}
                                            placeholder="Full name"
                                            value={customer.fullName}
                                            onChange={(e) => handleCustomerChange('fullName', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                        <Input
                                            prefix={<PhoneOutlined className="text-orange-500" />}
                                            placeholder="Phone number"
                                            value={customer.phoneNumber}
                                            onChange={(e) => handleCustomerChange('phoneNumber', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                        <Input.TextArea
                                            placeholder="Delivery address"
                                            value={customer.address}
                                            onChange={(e) => handleCustomerChange('address', e.target.value)}
                                            autoSize={{ minRows: 3, maxRows: 5 }}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </Card>

                                <Card className="rounded-[2.5rem] border-none shadow-xl p-6 bg-white">
                                    <Title level={3} className="mb-8 font-bold!">Order Summary</Title>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <Text className="text-gray-500 text-lg">Items</Text>
                                            <Text className="text-lg font-bold">{totalItems}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text className="text-gray-500 text-lg">Subtotal</Text>
                                            <Text className="text-lg font-bold">${subtotal.toFixed(2)}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text className="text-gray-500 text-lg">Tax (10%)</Text>
                                            <Text className="text-lg font-bold">${tax.toFixed(2)}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text className="text-gray-500 text-lg">Delivery Fee</Text>
                                            <Text className="text-lg font-bold">$5.00</Text>
                                        </div>
                                        <Divider className="my-6" />
                                        <div className="flex justify-between items-center mb-10">
                                            <Text className="text-xl font-bold">Total Amount</Text>
                                            <Text className="text-3xl font-black text-orange-600">${total.toFixed(2)}</Text>
                                        </div>
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            icon={<CreditCardOutlined />}
                                            loading={orderLoading}
                                            onClick={handleConfirmOrder}
                                            className="h-16 rounded-2xl bg-gray-900 border-none font-bold text-lg shadow-xl shadow-gray-200 mt-6"
                                        >
                                            Confirm Order
                                        </Button>
                                        <div className="text-center mt-6">
                                            <Text className="text-gray-400 text-sm">Cash On Delivery</Text>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Card className="rounded-[3rem] border-none shadow-sm py-24 text-center">
                        <Empty
                            description={<Text className="text-xl text-gray-400">Your cart is empty</Text>}
                            image={<ShoppingCartOutlined className="text-8xl text-gray-100" />}
                        />
                        <Link to="/menu" className="mt-8 inline-block">
                            <Button type="primary" size="large" className="bg-orange-500 border-none h-14 px-10 rounded-2xl font-bold">
                                Browse Menu
                            </Button>
                        </Link>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Cart;