import { useState, Suspense } from 'preact/hooks';
import Dashboard from './pages/Dashboard';
import Arsenal from './pages/Arsenal';
import MyPassages from './pages/MyPassages';
import Missions from './pages/Missions';
import Clan from './pages/Clan';
import Help from './pages/Help';

const App = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');

    const renderPage = () => {
        switch(currentPage) {
            case 'dashboard': return <Dashboard />;
            case 'arsenal': return <Arsenal />;
            case 'passages': return <MyPassages />;
            case 'missions': return <Missions />;
            case 'clan': return <Clan />;
            case 'help': return <Help />;
            default: return <Dashboard />;
        }
    };

    const getIconPath = (page) => {
        switch(page) {
            case 'dashboard':
                return currentPage === 'dashboard' ? '/assets/icons/interface/icon_profile.png' : '/assets/icons/interface/icon_profile.png';
            case 'arsenal':
                return currentPage === 'arsenal' ? '/assets/icons/interface/icon_shop.png' : '/assets/icons/interface/icon_shop.png';
            case 'passages':
                return currentPage === 'passages' ? '/assets/icons/functions/icon_vpn.png' : '/assets/icons/functions/icon_vpn.png';
            case 'missions':
                return currentPage === 'missions' ? '/assets/icons/interface/icon_mission.png' : '/assets/icons/interface/icon_mission.png';
            case 'clan':
                return currentPage === 'clan' ? '/assets/icons/interface/icon_clan.png' : '/assets/icons/interface/icon_clan.png';
            case 'help':
                return currentPage === 'help' ? '/assets/icons/interface/icon_help.png' : '/assets/icons/interface/icon_help.png';
            default:
                return '/assets/icons/interface/icon_profile.png';
        }
    };

    return (
        <div className="min-h-screen bg-ninja-bg">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-ninja-bg">Loading...</div>}>
                {renderPage()}
            </Suspense>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-ninja-bg border-t border-ninja-gray">
                <div className="grid grid-cols-6 gap-1 p-2">
                    <button 
                        onClick={() => setCurrentPage('dashboard')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                            currentPage === 'dashboard' ? 'bg-ninja-purple text-white' : 'text-gray-400'
                        }`}
                    >
                        <img src="/assets/icons/interface/icon_profile.png" alt="Home" className="w-6 h-6" />
                        <span className="text-xs mt-1">Home</span>
                    </button>
                    <button 
                        onClick={() => setCurrentPage('arsenal')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                            currentPage === 'arsenal' ? 'bg-ninja-purple text-white' : 'text-gray-400'
                        }`}
                    >
                        <img src="/assets/icons/interface/icon_shop.png" alt="Shop" className="w-6 h-6" />
                        <span className="text-xs mt-1">Shop</span>
                    </button>
                    <button 
                        onClick={() => setCurrentPage('passages')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                            currentPage === 'passages' ? 'bg-ninja-purple text-white' : 'text-gray-400'
                        }`}
                    >
                        <img src="/assets/icons/functions/icon_vpn.png" alt="Keys" className="w-6 h-6" />
                        <span className="text-xs mt-1">Keys</span>
                    </button>
                    <button 
                        onClick={() => setCurrentPage('missions')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                            currentPage === 'missions' ? 'bg-ninja-purple text-white' : 'text-gray-400'
                        }`}
                    >
                        <img src="/assets/icons/interface/icon_mission.png" alt="Missions" className="w-6 h-6" />
                        <span className="text-xs mt-1">Missions</span>
                    </button>
                    <button 
                        onClick={() => setCurrentPage('clan')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                            currentPage === 'clan' ? 'bg-ninja-purple text-white' : 'text-gray-400'
                        }`}
                    >
                        <img src="/assets/icons/interface/icon_clan.png" alt="Clan" className="w-6 h-6" />
                        <span className="text-xs mt-1">Clan</span>
                    </button>
                    <button 
                        onClick={() => setCurrentPage('help')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                            currentPage === 'help' ? 'bg-ninja-purple text-white' : 'text-gray-400'
                        }`}
                    >
                        <img src="/assets/icons/interface/icon_help.png" alt="Help" className="w-6 h-6" />
                        <span className="text-xs mt-1">Help</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default App;