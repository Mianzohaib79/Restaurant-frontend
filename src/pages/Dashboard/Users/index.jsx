import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Space, Avatar, Input, Select, Badge, Popconfirm, Modal, Form } from 'antd';
import { UserOutlined, SearchOutlined, EditOutlined, DeleteOutlined, MailOutlined, SafetyCertificateOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const handleEditClick = (user) => {
        setEditingUser(user);
        form.setFieldsValue({
            fullName: user.fullName || "",
            status: user.status || "active",
            phoneNumber: user.phoneNumber || "",
            address: user.address || "",
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = (values) => {
        setIsLoading(true);
        axios.patch(window.api + `/api/auth/update-user-by-superAdmin/${editingUser.uid}`, values, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
        })
            .then((res) => {
                if (res.status === 200) {
                    window.toastify(res.data.message || "User updated successfully", 'success');
                    const updatedUser = res.data.updateUser;
                    let newDocuments = documents.map(u => u.uid === editingUser.uid ? { ...u, ...updatedUser } : u);
                    setDocuments(newDocuments);
                    setFilteredDocs(newDocuments);
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                }
            }).catch((error) => {
                console.log(error);
                window.toastify(error?.response?.data?.message || "Something went wrong", 'error');
            }).finally(() => {
                setIsLoading(false);
            });
    };

    const getDocuments = async () => {
        setIsLoading(true);
        axios.get(window.api + "/api/auth/users", { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
            .then((res) => {
                if (res.status === 200) {
                    setDocuments(res.data.users);
                    setFilteredDocs(res.data.users);
                }
            }).catch((error) => {
                console.log(error);
                window.toastify(error?.response?.data?.message || "Something went wrong", 'error');
            }).finally(() => {
                setIsLoading(false);
            })
    };

    useEffect(() => { getDocuments(); }, []);

    const handleDelete = (user) => {
        setIsLoading(true);
        axios.delete(window.api + `/api/auth/delete-user-by-superAdmin/${user.uid}`, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
            .then((res) => {
                if (res.status === 200) {
                    window.toastify(res.data.message || "User deleted successfully", 'success');
                    let newDocuments = documents.filter(u => u.uid !== user.uid);
                    setDocuments(newDocuments);
                    setFilteredDocs(newDocuments);
                }
            }).catch((error) => {
                console.log(error);
                window.toastify(error?.response?.data?.message || "Something went wrong", 'error');
            }).finally(() => {
                setIsLoading(false);
            })
    };

    useEffect(() => {
        let filtered = documents.filter(user =>
            (user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchText.toLowerCase())) &&
            (roleFilter === "all" || user.role === roleFilter)
        );
        setFilteredDocs(filtered);
    }, [searchText, roleFilter, documents]);

    const columns = [
        {
            title: 'User',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 220, // Responsive width
            render: (text, record) => (
                <Space size="middle">
                    <Avatar size={42} icon={<UserOutlined />} className="bg-orange-100 text-orange-500 rounded-xl flex-shrink-0" />
                    <div className="min-w-0">
                        <Text className="font-bold text-gray-900 block truncate max-w-[140px]" title={text}>{text || 'N/A'}</Text>
                        <Text className="text-gray-400 text-xs flex items-center gap-1 truncate max-w-[150px]" title={record.email}>
                            <MailOutlined className="text-[10px]" /> {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Contact Details',
            key: 'contact',
            width: 200, // Responsive width
            render: (_, record) => (
                <div className="space-y-1">
                    <Text className="text-gray-600 text-xs flex items-center gap-2 whitespace-nowrap">
                        <PhoneOutlined className="text-orange-400 text-[10px]" /> {record.phoneNumber || 'N/A'}
                    </Text>
                    <Text className="text-gray-400 text-[11px] flex items-center gap-2 italic truncate max-w-[180px]" title={record.address}>
                        <EnvironmentOutlined className="text-gray-300 text-[10px]" /> {record.address || 'N/A'}
                    </Text>
                </div>
            )
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 130, // Responsive width
            render: (role) => {
                let color = 'orange';
                let label = 'Customer';
                if (role === 'superAdmin') {
                    color = 'purple';
                    label = 'Super Admin';
                }
                if (role === 'admin') {
                    color = 'blue';
                    label = 'Admin';
                }
                return <Tag color={color} className="rounded-full px-3 font-bold uppercase text-[10px] tracking-wider border-none">{label}</Tag>
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120, // Responsive width
            render: (status) => {
                let color = 'green';
                let label = 'Active';
                if (status === 'inactive') {
                    color = 'red';
                    label = 'Inactive';
                }
                return <Tag color={color} className="rounded-full px-3 font-bold uppercase text-[10px] tracking-wider border-none">{label}</Tag>
            }
        },
        {
            title: 'Joined Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140, // Responsive width
            render: (date) => (
                <div className="flex flex-col">
                    <Text className="text-gray-700 text-xs font-medium whitespace-nowrap">{date ? dayjs(date).format('MMM DD, YYYY') : 'N/A'}</Text>
                    <Text className="text-gray-400 text-[10px]">{date ? dayjs(date).format('hh:mm A') : ''}</Text>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            width: 110, // Responsive width
            fixed: 'right', // Freeze actions column on mobile horizontal scroll
            render: (record) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEditClick(record)} className="text-blue-500 hover:bg-blue-50 flex items-center justify-center h-9 w-9 rounded-lg" />
                    <Popconfirm
                        title="Delete User"
                        description="Are you sure you want to delete this user? This action cannot be undone."
                        onConfirm={() => handleDelete(record)}
                        okText="Yes, Delete"
                        cancelText="No"
                        okButtonProps={{ danger: true, className: "bg-red-500" }}
                    >
                        <Button type="text" icon={<DeleteOutlined />} className="text-red-500 hover:bg-red-50 flex items-center justify-center h-9 w-9 rounded-lg" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6 md:space-y-8 p-2 md:p-0">
            {/* Header section responsive layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <Title level={2} className="!mb-1 !font-bold flex items-center gap-3 !text-2xl md:!text-3xl">
                        <UserOutlined className="text-orange-500" /> User Management
                    </Title>
                    <Text className="text-gray-500 text-sm md:text-base">Manage user accounts, roles, and access permissions.</Text>
                </div>
            </div>

            {/* Main Card with inner elements adjustments */}
            <Card className="rounded-[1.5rem] md:rounded-[2.5rem] border-none shadow-sm overflow-hidden p-0 bg-white">
                <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-gray-50/30 gap-4">
                    <Input
                        prefix={<SearchOutlined className="text-gray-400" />}
                        placeholder="Search users by name or email..."
                        className="w-full sm:max-w-md h-11 md:h-12 rounded-xl border-gray-200"
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                    <div className="w-full sm:w-auto">
                        <Select
                            defaultValue="all"
                            className="w-full sm:w-44 h-11 md:h-12 custom-select"
                            onChange={(value) => setRoleFilter(value)}
                            popupClassName="rounded-xl"
                        >
                            <Option value="all">All Roles</Option>
                            <Option value="superAdmin"><UserOutlined /> Super Admin</Option>
                            <Option value="customer"><UserOutlined /> Customer</Option>
                        </Select>
                    </div>
                </div>

                {/* Table with horizontal scroll configuration */}
                <div className="responsive-table-wrapper">
                    <Table
                        columns={columns}
                        dataSource={filteredDocs}
                        loading={isLoading}
                        pagination={{ pageSize: 8 }}
                        className="custom-admin-table"
                        rowKey="_id"
                        scroll={{ x: 900 }} // Enables horizontal scrolling on small viewports
                    />
                </div>
            </Card>

            {/* Edit User Modal Form fields adjustments */}
            <Modal
                title={
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <Avatar className="bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0" icon={<EditOutlined />} />
                        <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800 m-0 truncate">Edit User Details</h3>
                            <p className="text-xs text-gray-400 m-0 truncate">Modify information for {editingUser?.fullName || 'this user'}</p>
                        </div>
                    </div>
                }
                open={isEditModalOpen}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                }}
                footer={null}
                centered
                destroyOnClose
                className="custom-edit-modal p-2 sm:p-0"
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateUser}
                    requiredMark={false}
                    className="space-y-4 pt-4"
                >
                    <Form.Item
                        name="fullName"
                        label={<span className="font-semibold text-gray-600 text-xs">Full Name</span>}
                        rules={[{ required: true, message: 'Please enter full name' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Enter your full name"
                            className="h-11 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label={<span className="font-semibold text-gray-600 text-xs">Account Status</span>}
                        rules={[{ required: true, message: 'Please select status' }]}
                    >
                        <Select
                            className="h-11 rounded-xl custom-select-status"
                            placeholder="Select status"
                            suffixIcon={<SafetyCertificateOutlined className="text-gray-400" />}
                            popupClassName="rounded-xl"
                        >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label={<span className="font-semibold text-gray-600 text-xs">Phone Number</span>}
                        rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                        <Input
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            placeholder="Enter your phone number"
                            className="h-11 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label={<span className="font-semibold text-gray-600 text-xs">Address</span>}
                        rules={[{ required: true, message: 'Please enter address' }]}
                    >
                        <Input
                            prefix={<EnvironmentOutlined className="text-gray-400" />}
                            placeholder="Enter your address"
                            className="h-11 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setEditingUser(null);
                            }}
                            className="h-10 sm:h-11 rounded-xl px-5 border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300 font-medium flex items-center justify-center"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            className="h-10 sm:h-11 rounded-xl px-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold border-none shadow-md shadow-orange-500/20 flex items-center justify-center"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Users;