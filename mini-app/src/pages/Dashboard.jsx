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
            loadUserData();
            // loadVpnStatus(); // Метода нет в бекенде
        }
    }, [user, isAuthenticated]);

    const loadUserData = async () => {
        try {
            // Используем правильный метод с telegramId
            const profile = await apiService.getUserProfile(user.id);
            setUserData(profile);
        } catch (error) {
            console.error('Failed to load user profile:', error);
            // Fallback данные если API не доступен
            setUserData({
                id: user?.id,
                username: user?.first_name || 'Ninja',
                level: 1,
                xp: 250,
                xp_to_next_level: 1000,
                stealth_level: 65,
                balance: 500,
                missions_completed: 3,
                ryo: 1500,
                clan: 'Shadow Clan'
            });
        }
    };

    const loadUserStats = async () => {
        try {
            const stats = await apiService.getUserStats(user.id);
            console.log('User stats:', stats);
        } catch (error) {
            console.log('User stats not available');
        }
    };

    const toggleConnection = async () => {
        try {
            if (connectionStatus.isConnected) {
                // В бекенде нет метода disconnect, просто меняем состояние
                setConnectionStatus(prev => ({ 
                    ...prev, 
                    isConnected: false,
                    ping: 0,
                    traffic: 0
                }));
            } else {
                // Создаем VPN подключение через бекенд
                const config = await apiService.createVPNConnection({
                    telegram_id: user.id,
                    public_key: 'mock_public_key_for_test' // В реальном приложении нужно генерировать
                });
                console.log('VPN config created:', config);
                
                setConnectionStatus(prev => ({ 
                    ...prev, 
                    isConnected: true,
                    ping: 45,
                    traffic: 128
                }));
            }
        } catch (error) {
            console.error('VPN operation failed:', error);
            // Fallback: меняем состояние локально для демо
            setConnectionStatus(prev => ({ 
                ...prev, 
                isConnected: !prev.isConnected,
                ping: prev.isConnected ? 0 : 45,
                traffic: prev.isConnected ? 0 : 128
            }));
        }
    };

    const handleGetVPNConfig = async () => {
        try {
            const config = await apiService.getVPNConfig(user.id);
            console.log('VPN Config:', config);
            // Здесь можно показать конфиг пользователю или скачать
            alert('VPN config loaded (check console)');
        } catch (error) {
            console.error('Failed to get VPN config:', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ninja-bg">
                <div className="text-center">
                    <img 
                        src="./assets/animations/loading_ninja_smoke.gif" 
                        alt="Loading"
                        className="w-60 h-60 mx-auto mb-4"
                    />
                    <p className="text-gray-400">Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ninja-bg text-white">
            {/* Header */}
            <div className="p-4 border-b border-ninja-gray">
                <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <img 
                        src="./assets/logo/logo_icon.png" 
                        alt="Logo"
                        className="w-6 h-6"
                    />
                    NetN1nja
                </h1>
            </div>

            {/* Main Content */}
            <div className="p-4 space-y-4">
                {/* Ninja Avatar Section */}
                <div className="text-center">
                    <N1njaAvatar 
                        status={connectionStatus.isConnected ? 'protect' : 'normal'} 
                        level={userData?.level || 1}
                        className="mx-auto"
                    />
                    <h2 className="text-xl font-semibold mt-2">
                        {userData?.username || user?.first_name || 'Shinobi'}
                    </h2>
                    <p className="text-ninja-purple text-sm">
                        Level {userData?.level || 1} • {userData?.clan || 'No Clan'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        ID: {user?.id || 'unknown'}
                    </p>
                </div>

                {/* Connection Status */}
                <ConnectionStatus {...connectionStatus} />

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={toggleConnection}
                        className={`ninja-button py-3 text-center font-semibold flex items-center justify-center gap-2 ${
                            connectionStatus.isConnected 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        <span className="text-xl">
                            {connectionStatus.isConnected ? '🔌' : '🛡️'}
                        </span>
                        {connectionStatus.isConnected ? 'Disconnect' : 'Connect VPN'}
                    </button>
                    <button 
                        onClick={handleGetVPNConfig}
                        className="ninja-button py-3 bg-ninja-blue text-center font-semibold hover:bg-ninja-blue/80 flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">📁</span>
                        Get Config
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="ninja-card p-4 text-center">
                        <div className="text-2xl font-bold text-ninja-yellow flex items-center justify-center gap-1">
                            <img 
                                src="./assets/icons/interface/icon_ryo.png" 
                                alt="Ryo"
                                className="w-6 h-6"
                            />
                            {userData?.ryo || 0}
                        </div>
                        <div className="text-sm text-gray-400">Ryo</div>
                    </div>
                    <div className="ninja-card p-4 text-center">
                        <div className="text-2xl font-bold text-ninja-green flex items-center justify-center gap-1">
                            <img 
                                src="./assets/icons/interface/icon_stars.png" 
                                alt="Stars"
                                className="w-6 h-6"
                            />
                            {userData?.balance || 0}
                        </div>
                        <div className="text-sm text-gray-400">Stars</div>
                    </div>
                    <div className="ninja-card p-4 text-center">
                        <div className="text-2xl font-bold text-ninja-pink flex items-center justify-center gap-1">
                            <img 
                                src="./assets/icons/interface/icon_shuriken.png" 
                                alt="Missions"
                                className="w-6 h-6"
                            />
                            {userData?.missions_completed || 0}
                        </div>
                        <div className="text-sm text-gray-400">Missions</div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="ninja-card p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <span className="text-ninja-purple">⚡</span>
                            Level Progress
                        </span>
                        <button 
                            onClick={loadUserStats}
                            className="text-xs px-2 py-1 bg-ninja-gray rounded hover:bg-ninja-purple/20"
                        >
                            Stats
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl font-bold text-ninja-purple">
                            {userData?.level || 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span>XP</span>
                                <span className="text-gray-400">
                                    {userData?.xp || 0}/{userData?.xp_to_next_level || 1000}
                                </span>
                            </div>
                            <div className="w-full bg-ninja-gray rounded-full h-3 overflow-hidden">
                                <div 
                                    className="h-3 rounded-full bg-gradient-to-r from-ninja-purple to-ninja-pink transition-all duration-500 level-progress"
                                    style={{ 
                                        width: `${Math.min(((userData?.xp || 0) / (userData?.xp_to_next_level || 1000)) * 100, 100)}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stealth Meter */}
                <StealthMeter stealthLevel={userData?.stealth_level || 65} />

                {/* Recent Activity */}
                <div className="ninja-card p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="text-ninja-blue">📈</span>
                        Recent Activity
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">VPN Connection</span>
                            <span className={`text-xs px-2 py-1 rounded ${connectionStatus.isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                {connectionStatus.isConnected ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Daily Login</span>
                            <span className="text-ninja-yellow">+50 Ryo</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Profile Updated</span>
                            <span className="text-green-400">✓</span>
                        </div>
                    </div>
                </div>

                {/* Developer Info */}
                <div className="text-center text-xs text-gray-500 pt-4 border-t border-ninja-gray">
                    <p>User ID: {user?.id}</p>
                    <p className="mt-1">
                        <button 
                            onClick={() => {
                                console.log('User Data:', userData);
                                console.log('Connection Status:', connectionStatus);
                            }}
                            className="text-ninja-purple hover:underline"
                        >
                            [Dev] Log State
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;