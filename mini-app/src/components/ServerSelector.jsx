// mini-app/src/components/ServerSelector.jsx
import { useState, useEffect } from 'preact/hooks';
import { apiService } from '../services/api';

const ServerSelector = ({ onServerSelect, currentServerId = null }) => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedServer, setSelectedServer] = useState(currentServerId);

    const loadServers = async () => {
        try {
            setLoading(true);
            console.log('🔄 Loading servers...');
            
            const serversData = await apiService.getAvailableServers();
            console.log('✅ Servers loaded:', serversData);
            
            setServers(serversData);
            
            // Если не выбран сервер, выбираем первый
            if (!selectedServer && serversData.length > 0) {
                setSelectedServer(serversData[0].id);
                if (onServerSelect) {
                    onServerSelect(serversData[0]);
                }
            }
        } catch (err) {
            console.error('❌ Error loading servers:', err);
            setError('Failed to load servers');
        } finally {
            setLoading(false);
        }
    };

    const handleServerSelect = (server) => {
        console.log('🎯 Server selected:', server);
        setSelectedServer(server.id);
        
        if (onServerSelect) {
            onServerSelect(server);
        }
    };

    const getCountryFlag = (countryCode) => {
        const flags = {
            jp: '🇯🇵',
            de: '🇩🇪',
            us: '🇺🇸',
            sg: '🇸🇬',
            fr: '🇫🇷',
            uk: '🇬🇧',
            nl: '🇳🇱',
            ca: '🇨🇦',
            au: '🇦🇺',
            ru: '🇷🇺',
            cn: '🇨🇳',
            kr: '🇰🇷',
        };
        return flags[countryCode.toLowerCase()] || '🌐';
    };

    const getLoadColor = (load) => {
        if (load < 40) return 'bg-green-500';
        if (load < 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getLatencyColor = (latency) => {
        if (latency < 50) return 'text-green-600';
        if (latency < 100) return 'text-yellow-600';
        return 'text-red-600';
    };

    useEffect(() => {
        loadServers();
    }, []);

    if (loading) {
        return (
            <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading servers...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                    <div className="w-6 h-6 text-red-500 mr-2">⚠️</div>
                    <div>
                        <p className="font-medium text-red-800">{error}</p>
                        <button 
                            onClick={loadServers}
                            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">🌍 Select Server</h3>
                <p className="text-sm text-gray-600">Choose your VPN server location</p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
                {servers.map((server) => (
                    <div 
                        key={server.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedServer === server.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => handleServerSelect(server)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">
                                    {server.flag || getCountryFlag(server.country_code)}
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-bold text-gray-800">{server.name}</h4>
                                        {server.premium && (
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                                PREMIUM
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {server.city}, {server.country}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <div className="flex items-center space-x-4">
                                    {/* Load indicator */}
                                    <div className="w-24">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">Load</span>
                                            <span className="text-xs font-medium">{server.load}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getLoadColor(server.load)}`}
                                                style={{ width: `${Math.min(server.load, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    {/* Latency */}
                                    <div className={`text-sm font-medium ${getLatencyColor(server.latency)}`}>
                                        {server.latency}ms
                                    </div>
                                    
                                    {/* Selection indicator */}
                                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                                        {selectedServer === server.id && (
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-2 flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        server.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                    <span className="text-xs text-gray-500 capitalize">{server.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Low load</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Medium</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>High load</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-medium">{servers.length}</span> servers available
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServerSelector;