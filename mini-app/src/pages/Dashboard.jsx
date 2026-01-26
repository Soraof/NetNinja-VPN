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
    const [showLoading, setShowLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && isAuthenticated) {
            loadUserData();
        }
    }, [user, isAuthenticated]);

    const loadUserData = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError(null);

        try {
            console.log('Loading user data for:', user?.id);
            
            // Загружаем все данные параллельно
            const [profileRes, statsRes, missionsRes] = await Promise.allSettled([
                apiService.getUserProfile(),
                apiService.getUserStats(),
                apiService.getDailyMissions()
            ]);

            const processedData = {
                id: user?.id,
                username: user?.first_name || 'Ninja',
                level: 1,
                xp: 0,
                xp_to_next_level: 1000,
                stealth_level: 50,
                balance: 0,
                ryo: 0,
                missions_completed: 0,
                clan: 'No Clan',
                total_connections: 0,
                daily_streak: 0
            };

            // Обработка профиля
            if (profileRes.status === 'fulfilled' && profileRes.value) {
                const profile = profileRes.value;
                processedData.username = profile.username || profile.first_name || user?.first_name || 'Ninja';
                processedData.level = profile.level || 1;
                processedData.clan = profile.clan_name || profile.clan || 'No Clan';
                processedData.id = profile.telegram_id || user?.id;
            }

            // Обработка статистики
            if (statsRes.status === 'fulfilled' && statsRes.value) {
                const stats = statsRes.value;
                processedData.xp = stats.current_xp || stats.xp || 0;
                processedData.xp_to_next_level = stats.xp_to_next_level || 1000;
                processedData.stealth_level = stats.stealth_level || stats.stealth || 50;
                processedData.balance = stats.balance || stats.currency_balance || 0;
                processedData.ryo = stats.currency_balance || stats.ryo || 0;
                processedData.total_connections = stats.total_connections || 0;
                processedData.daily_streak = stats.daily_streak || 0;
            }

            // Обработка миссий
            if (missionsRes.status === 'fulfilled' && missionsRes.value) {
                const missions = Array.isArray(missionsRes.value) ? missionsRes.value : [];
                processedData.missions_completed = missions.filter(m => m.completed || m.is_completed).length;
            }

            setUserData(processedData);
            console.log('Loaded user data:', processedData);
            
        } catch (err) {
            console.error('Failed to load user data:', err);
            setError(err.message);
            
            // Fallback данные
            setUserData({
                id: user?.id,
                username: user?.first_name || 'Ninja',
                level: 1,
                xp: 0,
                xp_to_next_level: 1000,
                stealth_level: 50,
                balance: 0,
                ryo: 0,
                missions_completed: 0,
                clan: 'No Clan',
                total_connections: 0,
                daily_streak: 0
            });
        } finally {
            setIsLoading(false);
            // Убираем загрузку через 2 секунды (или сразу, если данные загружены)
            setTimeout(() => setShowLoading(false), 8000);
        }
    };

    const loadUserStats = async () => {
        try {
            const stats = await apiService.getUserStats();
            console.log('User stats:', stats);
        } catch (error) {
            console.log('User stats not available:', error);
        }
    };

    const toggleConnection = async () => {
        if (isLoading || !user) return;
        setIsLoading(true);

        try {
            console.log('Toggling connection, current status:', connectionStatus.isConnected);
            
            if (connectionStatus.isConnected) {
                // Отключение VPN
                await apiService.toggleVPNConnection(false);
                setConnectionStatus({
                    isConnected: false,
                    ping: 0,
                    traffic: 0
                });
            } else {
                // Подключение VPN
                const result = await apiService.createVPNConnection({
                    telegram_id: user.id,
                    server_id: 'default'
                });
                
                setConnectionStatus({
                    isConnected: true,
                    ping: result.ping || result.latency || 45,
                    traffic: result.traffic || result.bytes_transferred || 128
                });
            }
        } catch (error) {
            console.error('VPN operation failed:', error);
            setError(error.message);
            alert('VPN operation failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetVPNConfig = async () => {
        if (isLoading || !user) return;
        setIsLoading(true);

        try {
            const config = await apiService.getVPNConfig();
            console.log('VPN Config:', config);
            
            if (config && (config.config || config.config_content)) {
                const configText = config.config || config.config_content;
                await navigator.clipboard.writeText(configText);
                alert('VPN config copied to clipboard!');
            } else {
                alert('No VPN config available');
            }
        } catch (error) {
            console.error('Failed to get VPN config:', error);
            setError(error.message);
            alert('Failed to get VPN config: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Экран загрузки
    if (showLoading || isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-ninja-bg">
                <div className="text-center max-w-md mx-4">
                    <img 
                        src="./assets/animations/meme.gif" 
                        alt="Loading"
                        className="w-80 h-80 mx-auto mb-6 rounded-lg"
                    />
                    
                    <p className="text-gray-300 text-xl mb-3 font-ninja tracking-wider">
                        {isLoading ? 'Loading Data...' : 'Entering Shadow Network...'}
                    </p>
                    
                    <p className="text-gray-500 text-sm">
                        Securing your connection with military-grade encryption
                    </p>
                    
                    {error && (
                        <p className="text-red-400 text-sm mt-2">{error}</p>
                    )}
                    
                    {import.meta.env.DEV && (
                        <button 
                            onClick={() => setShowLoading(false)}
                            className="mt-4 text-xs text-gray-500 hover:text-white px-3 py-1 border border-gray-700 rounded"
                        >
                            Skip Loading
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Основной интерфейс
    return (
        <div className="min-h-screen bg-ninja-bg text-white pb-20">
            {/* Header */}
            <div className="p-4 border-b border-ninja-gray sticky top-0 bg-ninja-bg z-10">
                <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <img 
                        src="./assets/logo/logo.png" 
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
                    <NinjaAvatar 
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
                    {userData?.daily_streak > 0 && (
                        <p className="text-xs text-ninja-yellow mt-1">
                            🔥 {userData.daily_streak} day streak
                        </p>
                    )}
                </div>

                {/* Connection Status */}
                <ConnectionStatus {...connectionStatus} />

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={toggleConnection}
                        disabled={isLoading}
                        className={`ninja-button py-3 text-center font-semibold flex items-center justify-center gap-2 ${
                            connectionStatus.isConnected 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="text-xl">
                            {connectionStatus.isConnected ? '⚔️' : '🫥'}
                        </span>
                        {isLoading ? 'Loading...' : 
                         connectionStatus.isConnected ? 'Disconnect' : 'Connect VPN'}
                    </button>
                    <button 
                        onClick={handleGetVPNConfig}
                        disabled={isLoading}
                        className="ninja-button py-3 bg-ninja-blue text-center font-semibold hover:bg-ninja-blue/80 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={isLoading}
                            className="text-xs px-2 py-1 bg-ninja-gray rounded hover:bg-ninja-purple/20 disabled:opacity-50"
                        >
                            Refresh
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
                <StealthMeter stealthLevel={userData?.stealth_level || 50} />

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
                            <span className="text-gray-300">Total Connections</span>
                            <span className="text-ninja-yellow">{userData?.total_connections || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Profile Updated</span>
                            <span className="text-green-400">✓</span>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-center">
                        <p className="text-red-400 text-sm">Error: {error}</p>
                    </div>
                )}

                {/* Developer Info */}
                <div className="text-center text-xs text-gray-500 pt-4 border-t border-ninja-gray">
                    <p>User ID: {user?.id}</p>
                    <p className="mt-1">
                        <button 
                            onClick={() => console.log('State:', {userData, connectionStatus, user})}
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
