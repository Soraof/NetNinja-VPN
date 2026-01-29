import { useState, useEffect } from 'preact/hooks';
import { apiService } from '../services/api';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

const MyPassages = () => {
    const { user } = useTelegramAuth();
    const [vpnConfig, setVpnConfig] = useState(null);
    const [availableServers, setAvailableServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [activeTab, setActiveTab] = useState('keys');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            loadAllData();
        }
    }, [user]);

    const loadAllData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Загружаем конфиг (без серверов, т.к. их пока нет)
            const configRes = await apiService.getVPNConfig();
            setVpnConfig(configRes);

        } catch (err) {
            console.error('Failed to load data:', err);
            setError(err.message);
            // Fallback для конфига
            setVpnConfig({
                public_key: 'not_generated_yet',
                private_key: 'not_generated_yet',
                config: '[Interface]\n# No configuration available yet'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text) => {
        if (!text) return;
        
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        }
    };

    const generateQRCode = (config) => {
        if (!config || !config.config) {
            return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" font-size="12" text-anchor="middle" dominant-baseline="middle">No config available</text></svg>`;
        }
        
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" font-size="10" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(config.config.substring(0, 30))}...</text></svg>`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-ninja-bg text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ninja-purple mx-auto mb-4"></div>
                    <p>Loading VPN data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ninja-bg text-white pb-20">
            {/* Header */}
            <div className="p-4 border-b border-ninja-gray sticky top-0 bg-ninja-bg z-10">
                <h1 className="text-2xl font-bold text-center">🥷 My Passages</h1>
                <p className="text-center text-gray-400 text-sm">Your VPN credentials</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-ninja-gray sticky top-16 bg-ninja-bg z-10">
                <button 
                    className={`flex-1 py-3 font-medium ${activeTab === 'keys' ? 'text-ninja-purple border-b-2 border-ninja-purple' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('keys')}
                >
                    Keys
                </button>
                <button 
                    className={`flex-1 py-3 font-medium ${activeTab === 'configs' ? 'text-ninja-purple border-b-2 border-ninja-purple' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('configs')}
                >
                    Configs
                </button>
                <button 
                    className={`flex-1 py-3 font-medium ${activeTab === 'servers' ? 'text-ninja-purple border-b-2 border-ninja-purple' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('servers')}
                >
                    Servers
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 m-4 text-center">
                    <p className="text-red-400 text-sm">Error: {error}</p>
                </div>
            )}

            {/* Tab Content */}
            <div className="p-4 space-y-4">
                {activeTab === 'keys' && (
                    <div className="space-y-4">
                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">Public Key</h3>
                            <div className="flex items-center space-x-2">
                                <code className="flex-1 bg-ninja-gray p-2 rounded text-sm break-all">
                                    {vpnConfig?.public_key || vpnConfig?.peer?.public_key || 'Generating...'}
                                </code>
                                <button 
                                    onClick={() => copyToClipboard(vpnConfig?.public_key || vpnConfig?.peer?.public_key || '')}
                                    className="px-3 py-1 bg-ninja-purple rounded text-sm hover:bg-ninja-purple/80"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">Private Key</h3>
                            <div className="flex items-center space-x-2">
                                <code className="flex-1 bg-ninja-gray p-2 rounded text-sm break-all">
                                    {vpnConfig?.private_key ? '•'.repeat(28) : 'Generating...'}
                                </code>
                                <button 
                                    onClick={() => copyToClipboard(vpnConfig?.private_key || '')}
                                    className="px-3 py-1 bg-ninja-purple rounded text-sm hover:bg-ninja-purple/80"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                ⚠️ Keep this private key secure. Never share it with anyone.
                            </p>
                        </div>

                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">QR Code</h3>
                            <div className="flex justify-center">
                                <img 
                                    src={generateQRCode(vpnConfig)} 
                                    alt="VPN Configuration QR Code" 
                                    className="w-48 h-48 border border-ninja-gray rounded"
                                />
                            </div>
                            <button 
                                onClick={() => setShowQR(!showQR)}
                                className="w-full mt-3 py-2 bg-ninja-blue rounded text-sm hover:bg-ninja-blue/80"
                            >
                                {showQR ? 'Hide QR Code' : 'Show QR Code'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'configs' && (
                    <div className="space-y-4">
                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">WireGuard Config (.conf)</h3>
                            <textarea 
                                value={vpnConfig?.config || vpnConfig?.config_content || '[Interface]\n# Configuration will be generated here'}
                                readOnly
                                className="w-full h-40 bg-ninja-gray p-2 rounded text-sm font-mono resize-none"
                            />
                            <button 
                                onClick={() => copyToClipboard(vpnConfig?.config || vpnConfig?.config_content || '')}
                                className="w-full mt-2 py-2 bg-ninja-purple rounded text-sm hover:bg-ninja-purple/80"
                            >
                                Copy Config
                            </button>
                        </div>

                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">Download Options</h3>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => {
                                        const element = document.createElement('a');
                                        const file = new Blob([vpnConfig?.config || vpnConfig?.config_content || ''], { type: 'text/plain' });
                                        element.href = URL.createObjectURL(file);
                                        element.download = 'netninja.conf';
                                        document.body.appendChild(element);
                                        element.click();
                                        document.body.removeChild(element);
                                    }}
                                    className="w-full py-2 bg-ninja-blue rounded text-sm hover:bg-ninja-blue/80"
                                >
                                    Download .conf file
                                </button>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(vpnConfig?.config || vpnConfig?.config_content || '');
                                        alert('Config copied to clipboard. You can now import it to WireGuard app.');
                                    }}
                                    className="w-full py-2 bg-ninja-purple rounded text-sm hover:bg-ninja-purple/80"
                                >
                                    Import to WireGuard app
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'servers' && (
                    <div className="space-y-4">
                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-3">Available Servers</h3>
                            <div className="text-center py-8 text-gray-400">
                                Server functionality coming soon...
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPassages;