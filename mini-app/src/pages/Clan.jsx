import { useState, useEffect } from 'preact/hooks';
import { apiService } from '../services/api';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

const Clan = () => {
    const { user } = useTelegramAuth();
    const [referralLink, setReferralLink] = useState('');
    const [referralStats, setReferralStats] = useState({
        total_referrals: 0,
        active_users: 0,
        earned_rewards: 0
    });

    useEffect(() => {
        loadReferralInfo();
    }, [user]);

    const loadReferralInfo = async () => {
        try {
            const link = await apiService.getReferralLink(user.id);
            const stats = await apiService.getReferralStats(user.id); // Assuming this endpoint exists
            
            setReferralLink(link);
            setReferralStats(stats);
        } catch (error) {
            console.error('Failed to load referral info:', error);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Referral link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const shareLink = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join NetNinja VPN',
                text: 'Protect your privacy with me using NetNinja VPN!',
                url: referralLink
            }).catch(console.error);
        } else {
            copyToClipboard(referralLink);
        }
    };

    return (
        <div className="min-h-screen bg-ninja-bg text-white">
            {/* Header */}
            <div className="p-4 border-b border-ninja-gray">
                <h1 className="text-2xl font-bold text-center">🥷 Clan</h1>
                <p className="text-center text-gray-400 text-sm">Build your network, earn rewards</p>
            </div>

            {/* Stats Overview */}
            <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="ninja-card p-3 text-center">
                        <div className="text-2xl font-bold text-ninja-yellow">{referralStats.total_referrals}</div>
                        <div className="text-xs text-gray-400">Total Invited</div>
                    </div>
                    <div className="ninja-card p-3 text-center">
                        <div className="text-2xl font-bold text-ninja-green">{referralStats.active_users}</div>
                        <div className="text-xs text-gray-400">Active Users</div>
                    </div>
                    <div className="ninja-card p-3 text-center">
                        <div className="text-2xl font-bold text-ninja-purple">{referralStats.earned_rewards}</div>
                        <div className="text-xs text-gray-400">Stars Earned</div>
                    </div>
                </div>
            </div>

            {/* Referral Section */}
            <div className="p-4 space-y-4">
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">Your Referral Link</h3>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="text" 
                            value={referralLink}
                            readOnly
                            className="flex-1 bg-ninja-gray p-2 rounded text-sm"
                        />
                        <button 
                            onClick={() => copyToClipboard(referralLink)}
                            className="px-3 py-2 bg-ninja-purple rounded text-sm"
                        >
                            Copy
                        </button>
                    </div>
                    <button 
                        onClick={shareLink}
                        className="w-full mt-3 py-2 bg-ninja-blue rounded text-sm flex items-center justify-center space-x-2"
                    >
                        <span>Share Link</span>
                        <span>↗️</span>
                    </button>
                </div>

                {/* Rewards System */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">Rewards System</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-ninja-gray rounded">
                            <div className="flex items-center space-x-2">
                                <img src="/assets/icons/rewards/icon_stars.png" alt="Stars" className="w-5 h-5" />
                                <span>First Referral</span>
                            </div>
                            <span className="text-ninja-yellow font-semibold">+50 ⭐</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-ninja-gray rounded">
                            <div className="flex items-center space-x-2">
                                <img src="/assets/icons/rewards/icon_stars.png" alt="Stars" className="w-5 h-5" />
                                <span>5 Active Referrals</span>
                            </div>
                            <span className="text-ninja-yellow font-semibold">+200 ⭐</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-ninja-gray rounded">
                            <div className="flex items-center space-x-2">
                                <img src="/assets/icons/rewards/icon_stars.png" alt="Stars" className="w-5 h-5" />
                                <span>Monthly Bonus</span>
                            </div>
                            <span className="text-ninja-yellow font-semibold">+10 ⭐/user</span>
                        </div>
                    </div>
                </div>

                {/* Top Referrers */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">Top Clan Members</h3>
                    <div className="space-y-2">
                        {[
                            { name: 'ShadowMaster', referrals: 25, level: 45 },
                            { name: 'StealthNinja', referrals: 18, level: 38 },
                            { name: 'GhostWarrior', referrals: 12, level: 32 },
                            { name: 'user.id', referrals: 8, level: 25 }
                        ].map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-ninja-gray rounded">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-ninja-purple rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </div>
                                    <span className="font-medium">{member.name}</span>
                                    <img 
                                        src={`/assets/avatars/avatar_${member.level >= 50 ? 'legend' : member.level >= 40 ? 'demon' : member.level >= 30 ? 'shadow' : member.level >= 20 ? 'warrior' : 'rookie'}.png`} 
                                        alt="Level" 
                                        className="w-6 h-6"
                                    />
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{member.referrals}</div>
                                    <div className="text-xs text-gray-400">referrals</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invite Methods */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">Invite Methods</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 bg-ninja-gray rounded flex flex-col items-center space-y-2">
                            <span>📧</span>
                            <span className="text-sm">Email</span>
                        </button>
                        <button className="p-3 bg-ninja-gray rounded flex flex-col items-center space-y-2">
                            <span>💬</span>
                            <span className="text-sm">Telegram</span>
                        </button>
                        <button className="p-3 bg-ninja-gray rounded flex flex-col items-center space-y-2">
                            <span>🔗</span>
                            <span className="text-sm">Link</span>
                        </button>
                        <button className="p-3 bg-ninja-gray rounded flex flex-col items-center space-y-2">
                            <span>📱</span>
                            <span className="text-sm">QR Code</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Clan;