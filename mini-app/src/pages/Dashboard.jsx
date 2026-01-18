import { useState, useEffect } from 'preact/hooks';
import NinjaAvatar from '../components/NinjaAvatar';
import StealthMeter from '../components/StealthMeter';
import ConnectionStatus from '../components/ConnectionStatus';
import { apiService } from '../services/api';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

const Dashboard = () => {
    const { user, isAuthenticated } = useTelegramAuth();
    const [userData, setUserData] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: false,
        ping: 0,
        traffic: 0
    });

    useEffect(() => {
        if (user && isAuthenticated) {
            loadUserProfile();
        }
    }, [user, isAuthenticated]);

    const loadUserProfile = async () => {
        try {
            const profile = await apiService.getUserProfile(user.id);
            setUserData(profile);
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    };

    const toggleConnection = async () => {
        try {
            if (connectionStatus.isConnected) {
                // Disconnect logic
                setConnectionStatus(prev => ({ ...prev, isConnected: false }));
            } else {
                // Connect logic
                const config = await apiService.createVPNConnection({
                    telegram_id: user.id,
                    public_key: 'temp_public_key'
                });
                setConnectionStatus(prev => ({ 
                    ...prev, 
                    isConnected: true,
                    ping: Math.floor(Math.random() * 100),
                    traffic: Math.floor(Math.random() * 500)
                }));
            }
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ninja-bg">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-ninja-purple border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ninja-bg text-white">
            {/* Header */}
            <div className="p-4 border-b border-ninja-gray">
                <h1 className="text-2xl font-bold text-center">🥷 NetNinja</h1>
            </div>

            {/* Main Content */}
            <div className="p-4 space-y-4">
                {/* Ninja Avatar Section */}
                <div className="text-center">
                    <NinjaAvatar 
                        status={connectionStatus.isConnected ? 'protect' : 'normal'} 
                        level={userData?.level || 1}
                        className="mx-auto"
                    />
                    <h2 className="text-xl font-semibold mt-2">
                        Welcome, {user?.first_name || 'Shinobi'}!
                    </h2>
                </div>

                {/* Connection Status */}
                <ConnectionStatus {...connectionStatus} />

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={toggleConnection}
                        className={`ninja-button py-3 text-center font-semibold ${
                            connectionStatus.isConnected 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {connectionStatus.isConnected ? 'Disconnect' : 'Connect'}
                    </button>
                    <button className="ninja-button py-3 bg-ninja-blue text-center font-semibold hover:bg-ninja-blue/80">
                        Change Server
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="ninja-card p-4 text-center">
                        <div className="text-2xl font-bold text-ninja-yellow">
                            {userData?.balance || 0}
                        </div>
                        <div className="text-sm text-gray-400">Balance</div>
                    </div>
                    <div className="ninja-card p-4 text-center">
                        <div className="text-2xl font-bold text-ninja-green">
                            {userData?.missions_completed || 0}
                        </div>
                        <div className="text-sm text-gray-400">Missions</div>
                    </div>
                </div>

                {/* Stealth Meter */}
                <StealthMeter stealthLevel={userData?.stealth_level || 75} />

                {/* XP Progress */}
                <div className="ninja-card p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">XP Progress</span>
                        <span className="text-sm text-gray-400">
                            {userData?.xp || 0}/{userData?.xp_to_next_level || 1000}
                        </span>
                    </div>
                    <div className="w-full bg-ninja-gray rounded-full h-3">
                        <div 
                            className="h-3 rounded-full bg-gradient-to-r from-ninja-purple to-ninja-pink transition-all duration-500"
                            style={{ 
                                width: `${Math.min(((userData?.xp || 0) / (userData?.xp_to_next_level || 1000)) * 100, 100)}%` 
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;