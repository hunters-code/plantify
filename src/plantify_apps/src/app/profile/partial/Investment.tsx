"use client";

import { useState } from "react";

export default function Investment() {
    const [selectedProfile, setSelectedProfile] = useState("moderate");

    return (
        <div className="text-sm">
            {/* Investment Statistics */}
            <section className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Investment Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Invested", value: "$2,450" },
                        { label: "Total Returns", value: "+$187" },
                        { label: "Active Investments", value: "12" },
                        { label: "Average ROI", value: "7.6%" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="bg-white p-4 rounded-2xl border border-gray-100"
                        >
                            <p className="text-gray-500 text-xs">{item.label}</p>
                            <p className="text-base font-semibold mt-1">{item.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Risk Profile Settings */}
            <section className="bg-gray-50 p-4 rounded-lg mt-4">
                <h2 className="text-lg font-semibold mb-4">Risk Profile Settings</h2>
                <div className="space-y-4">
                    {[
                        {
                            id: "conservative",
                            title: "Conservative",
                            desc: "Low risk, stable returns. Focus on established startups with proven track records.",
                            tags: [
                                "Low volatility",
                                "Steady returns",
                                "Capital preservation",
                                "Established companies",
                            ],
                        },
                        {
                            id: "moderate",
                            title: "Moderate",
                            desc: "Balanced approach with moderate risk and growth potential.",
                            tags: [
                                "Balanced risk/reward",
                                "Diversified portfolio",
                                "Growth potential",
                                "Some volatility",
                            ],
                        },
                        {
                            id: "aggressive",
                            title: "Aggressive",
                            desc: "High risk, high reward. Focus on early-stage startups with high growth potential.",
                            tags: [
                                "High volatility",
                                "High growth potential",
                                "Early-stage focus",
                                "Higher risk tolerance",
                            ],
                        },
                    ].map((profile) => (
                        <label
                            key={profile.id}
                            className={`flex flex-col gap-2 border rounded-2xl p-4 cursor-pointer transition ${selectedProfile === profile.id
                                ? "border-indigo-500 bg-indigo-50/50"
                                : "border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="riskProfile"
                                    value={profile.id}
                                    checked={selectedProfile === profile.id}
                                    onChange={(e) => setSelectedProfile(e.target.value)}
                                    className="accent-indigo-500 w-4 h-4"
                                />
                                <span className="font-medium">{profile.title}</span>
                                {selectedProfile === profile.id && (
                                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                        Current
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600">{profile.desc}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profile.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </label>
                    ))}
                </div>
            </section>

            {/* Investment Settings */}
            <section className="bg-gray-50 p-4 rounded-lg mt-4">
                <h2 className="text-lg font-semibold mb-4">Investment Settings</h2>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-xs mb-1">
                                Monthly Investment Budget ($)
                            </label>
                            <input
                                type="text"
                                defaultValue="1,000"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-xs mb-1">
                                Investment Horizon
                            </label>
                            <input
                                type="text"
                                defaultValue="5-10 years"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-xs mb-2">
                            Investment Goals
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                "Portfolio Diversification",
                                "Sustainable Returns",
                                "Support Local Startups",
                            ].map((goal) => (
                                <span
                                    key={goal}
                                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                >
                                    {goal}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
