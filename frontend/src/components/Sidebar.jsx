import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Award, Users, Building2, MessageSquare, Search, Bell, Settings,
    LogOut, Menu, X, Plus
} from 'lucide-react';

const Sidebar = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left - Logo & Menu */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#294F7B] to-[#1d3855] rounded-lg flex items-center justify-center shadow-md">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold hidden sm:block">
                                    <span className="text-[#294F7B]">Care</span><span className="text-gray-900">Connect</span>
                                </span>
                            </div>
                        </div>

                        {/* Center - Search */}
                        <div className="hidden md:flex flex-1 max-w-xl mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search workers or ratings..."
                                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Right - Actions */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="hidden sm:flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">John Doe</p>
                                    <p className="text-xs text-gray-600">Manager</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-[#294F7B] to-[#1d3855] rounded-full flex items-center justify-center text-white font-bold">
                                    J
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    <nav className="p-4 space-y-2 mt-4">
                        <button
                            onClick={() => {
                                navigate('/manager-dashboard');
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/manager-dashboard') ? 'bg-[#294F7B] text-white' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Building2 className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </button>

                        <button
                            onClick={() => {
                                navigate('/workers');
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/workers') ? 'bg-[#294F7B] text-white' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Workers</span>
                        </button>

                        <button
                            onClick={() => {
                                navigate('/ratings');
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/ratings') ? 'bg-[#294F7B] text-white' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-medium">Reviews</span>
                        </button>

                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    navigate('/settings');
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/settings') ? 'bg-[#294F7B] text-white' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Settings className="w-5 h-5" />
                                <span className="font-medium">Settings</span>
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Sidebar;
