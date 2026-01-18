import { useState } from 'preact/hooks';

const Help = () => {
    const [activeFAQ, setActiveFAQ] = useState(null);

    const faqs = [
        {
            question: "How do I connect to VPN?",
            answer: "Go to the Dashboard page and click the 'Connect' button. Your VPN will be activated automatically."
        },
        {
            question: "What is WireGuard protocol?",
            answer: "WireGuard is a modern, fast, and secure VPN protocol that provides better performance than traditional protocols like OpenVPN."
        },
        {
            question: "How do I change servers?",
            answer: "In the 'My Passages' section, tap on 'Change Server' to select from available server locations worldwide."
        },
        {
            question: "How does the referral system work?",
            answer: "Share your referral link from the 'Clan' section. When others sign up using your link, you earn stars as rewards."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we use military-grade encryption (AES-256) and maintain a strict zero-logs policy to protect your privacy."
        },
        {
            question: "How do I upgrade my plan?",
            answer: "Visit the 'Arsenal' section to view all available plans and upgrade to higher tiers with more features."
        }
    ];

    return (
        <div className="min-h-screen bg-ninja-bg text-white">
            {/* Header */}
            <div className="p-4 border-b border-ninja-gray">
                <h1 className="text-2xl font-bold text-center">🥷 Help & Support</h1>
                <p className="text-center text-gray-400 text-sm">Get assistance with NetNinja</p>
            </div>

            {/* Support Sections */}
            <div className="p-4 space-y-4">
                {/* Contact */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">Contact Support</h3>
                    <div className="space-y-3">
                        <button className="w-full py-3 bg-ninja-purple rounded flex items-center justify-center space-x-2">
                            <span>💬</span>
                            <span>Contact via Telegram</span>
                        </button>
                        <button className="w-full py-3 bg-ninja-blue rounded flex items-center justify-center space-x-2">
                            <span>📧</span>
                            <span>Email Support</span>
                        </button>
                    </div>
                </div>

                {/* FAQ */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-ninja-gray last:border-b-0">
                                <button
                                    className="w-full py-3 text-left flex justify-between items-center"
                                    onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                                >
                                    <span className="font-medium">{faq.question}</span>
                                    <span>{activeFAQ === index ? '▲' : '▼'}</span>
                                </button>
                                {activeFAQ === index && (
                                    <div className="pb-3 pl-4 pr-2 text-gray-300 text-sm">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Safety Tips */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">Safety Tips</h3>
                    <div className="space-y-2">
                        <div className="flex items-start space-x-3 p-3 bg-ninja-gray rounded">
                            <span className="text-green-400">✓</span>
                            <div>
                                <div className="font-medium">Always use strong passwords</div>
                                <div className="text-sm text-gray-400">For your device and any accounts</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-ninja-gray rounded">
                            <span className="text-green-400">✓</span>
                            <div>
                                <div className="font-medium">Keep software updated</div>
                                <div className="text-sm text-gray-400">Regularly update your OS and apps</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-ninja-gray rounded">
                            <span className="text-green-400">✓</span>
                            <div>
                                <div className="font-medium">Be cautious with public Wi-Fi</div>
                                <div className="text-sm text-gray-400">Always connect to VPN when using public networks</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Troubleshooting */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">Troubleshooting</h3>
                    <div className="space-y-2">
                        <div className="p-3 bg-ninja-gray rounded">
                            <div className="font-medium mb-1">Connection Issues</div>
                            <div className="text-sm text-gray-400">Try changing server location or check your internet connection.</div>
                        </div>
                        <div className="p-3 bg-ninja-gray rounded">
                            <div className="font-medium mb-1">Slow Speed</div>
                            <div className="text-sm text-gray-400">Connect to a closer server or try during off-peak hours.</div>
                        </div>
                        <div className="p-3 bg-ninja-gray rounded">
                            <div className="font-medium mb-1">App Crashes</div>
                            <div className="text-sm text-gray-400">Clear cache or reinstall the app from Telegram.</div>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold mb-3">About NetNinja</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p>NetNinja is a premium VPN service designed for ultimate privacy and security.</p>
                        <p>We use industry-standard encryption and maintain no logs of your activity.</p>
                        <p>Our service is built for speed, reliability, and seamless integration with Telegram.</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-ninja-gray text-center text-xs text-gray-500">
                        Version 1.0.0 • Privacy First • Security Always
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;