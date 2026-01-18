import { useState, useEffect } from 'preact/hooks';
import { apiService } from '../services/api';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

const MyPassages = () => {
    const { user } = useTelegramAuth();
    const [vpnConfig, setVpnConfig] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [activeTab, setActiveTab] = useState('keys');

    const loadVPNConfig = async () => {
        try {
            const config = await apiService.getVPNConfig(user.id);
            setVpnConfig(config);
        } catch (error) {
            console.error('Failed to load VPN config:', error);
        }
    };

    useEffect(() => {
        if (user) {
            loadVPNConfig();
        }
    }, [user]);

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const generateQRCode = (config) => {
        // In real implementation, you would use a QR code library
        // For now, returning a placeholder
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" font-size="12" text-anchor="middle" dominant-baseline="middle">QR CODE PLACEHOLDER</text></svg>`;
    };

    return (
        <div className="min-h-screen bg-ninja-bg text-white">
            {/* Header */}
            <div className="p-4 border-b border-ninja-gray">
                <h1 className="text-2xl font-bold text-center">🥷 My Passages</h1>
                <p className="text-center text-gray-400 text-sm">Your VPN credentials</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-ninja-gray">
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

            {/* Tab Content */}
            <div className="p-4 space-y-4">
                {activeTab === 'keys' && (
                    <div className="space-y-4">
                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">Public Key</h3>
                            <div className="flex items-center space-x-2">
                                <code className="flex-1 bg-ninja-gray p-2 rounded text-sm break-all">
                                    {vpnConfig?.public_key || 'Generating...'}
                                </code>
                                <button 
                                    onClick={() => copyToClipboard(vpnConfig?.public_key || '')}
                                    className="px-3 py-1 bg-ninja-purple rounded text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">Private Key</h3>
                            <div className="flex items-center space-x-2">
                                <code className="flex-1 bg-ninja-gray p-2 rounded text-sm break-all">
                                    {vpnConfig?.private_key ? '•'.repeat(44) : 'Generating...'}
                                </code>
                                <button 
                                    onClick={() => copyToClipboard(vpnConfig?.private_key || '')}
                                    className="px-3 py-1 bg-ninja-purple rounded text-sm"
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
                                className="w-full mt-3 py-2 bg-ninja-blue rounded text-sm"
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
                                value={vpnConfig?.config || '[Interface]\n# Configuration will be generated here'}
                                readOnly
                                className="w-full h-40 bg-ninja-gray p-2 rounded text-sm font-mono"
                            />
                            <button 
                                onClick={() => copyToClipboard(vpnConfig?.config || '')}
                                className="w-full mt-2 py-2 bg-ninja-purple rounded text-sm"
                            >
                                Copy Config
                            </button>
                        </div>

                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">Download Options</h3>
                            <div className="space-y-2">
                                <button className="w-full py-2 bg-ninja-blue rounded text-sm">
                                    Download .conf file
                                </button>
                                <button className="w-full py-2 bg-ninja-purple rounded text-sm">
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
                            <div className="space-y-3">
                                {[
                                    { id: 'us-east', name: 'United States (East)', ping: '25ms', status: 'online' },
                                    { id: 'us-west', name: 'United States (West)', ping: '45ms', status: 'online' },
                                    { id: 'eu-central', name: 'Europe (Central)', ping: '35ms', status: 'online' },
                                    { id: 'asia-singapore', name: 'Asia (Singapore)', ping: '85ms', status: 'online' },
                                    { id: 'south-america', name: 'South America', ping: '120ms', status: 'online' }
                                ].map(server => (
                                    <div key={server.id} className="flex items-center justify-between p-3 bg-ninja-gray rounded">
                                        <div>
                                            <div className="font-medium">{server.name}</div>
                                            <div className="text-sm text-gray-400">{server.ping}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs ${
                                            server.status === 'online' ? 'bg-green-600' : 'bg-red-600'
                                        }`}>
                                            {server.status.toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ninja-card p-4">
                            <h3 className="font-bold mb-2">Current Server</h3>
                            <div className="p-3 bg-ninja-gray rounded">
                                <div className="font-medium">United States (East)</div>
                                <div className="text-sm text-green-400">Connected • 25ms ping</div>
                            </div>
                            <button className="w-full mt-3 py-2 bg-ninja-purple rounded text-sm">
                                Change Server
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPassages;