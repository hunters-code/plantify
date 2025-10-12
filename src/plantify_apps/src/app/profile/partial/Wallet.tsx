"use client";

import { Button } from "@/components";
import { ICPIcon } from "@/components/icons";
import { Wallet, ArrowUpRightFromSquare, CreditCard } from "lucide-react";

export default function WalletPage() {
    const walletStats = [
        { label: "Total Balance", value: "1,250.75 ICP" },
        { label: "Available for Withdrawal", value: "850.25 ICP" },
        { label: "Invested in Startups", value: "400.50 ICP" },
    ];

    const withdrawHistory = [
        {
            amount: "500 ICP",
            address: "0x742d35Cc...5a3b8D",
            status: "Completed",
            date: "2025/01/15",
        },
        {
            amount: "200 ICP",
            address: "0x742d35Cc...5a3b8D",
            status: "Completed",
            date: "2025/01/15",
        },
    ];

    return (
        <div className="mx-auto space-y-6">
            {/* ICP Wallet Balance */}
            <section className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ICPIcon />
                        ICP Wallet Balance
                    </h2>
                    <Button
                        variant="primary"
                        className="flex items-center gap-2 h-12"
                        onClick={() => console.log("Withdraw clicked")}
                    >
                        <CreditCard size={16} />
                        Withdraw to External Wallet
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {walletStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white p-4 rounded-xl border border-gray-100"
                        >
                            <p className="text-gray-500 text-xs">{stat.label}</p>
                            <p className="text-base font-semibold mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Withdraw History */}
            <section className="bg-gray-50 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Withdraw History</h2>
                <div className="space-y-4">
                    {withdrawHistory.map((tx, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center bg-white p-4 rounded-lg border-b border-gray-100 pb-3 last:border-0"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-800">{tx.amount}</p>
                                <p className="text-xs text-gray-500 mt-1">To: {tx.address}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
                                    {tx.status}
                                </span>
                                <p className="text-xs text-gray-400 mt-1">{tx.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Wallet Informations */}
            <section className="bg-gray-50 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Wallet Informations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Side */}
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Support Wallet Types
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>Ethereum (0x...)</li>
                            <li>Bitcoin (1... or 3...)</li>
                            <li>ICP Principal ID</li>
                        </ul>
                    </div>

                    {/* Right Side */}
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Withdrawal Details
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>Minimum withdrawal: 10 ICP</li>
                            <li>Processing time: 1-3 business days</li>
                            <li>Network fees: 0.1 ICP</li>
                            <li>Daily limit: 1,000 ICP</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
