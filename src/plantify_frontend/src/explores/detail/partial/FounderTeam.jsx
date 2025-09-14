import { Award } from "lucide-react";

export default function FounderTeam() {
    const founders = [
        {
            name: "Anna Rodriguez",
            role: "CEO & Founder",
            img: "/assets/images/user.png",
        },
        {
            name: "Marcus Johnson",
            role: "CTO",
            img: "/assets/images/user.png",
        },
        {
            name: "Lisa Chen",
            role: "Head of Product",
            img: "/assets/images/user.png",
        },
    ];

    const achievements = [
        "Published 25+ research papers",
        "TED Speaker on Smart Farming",
        "Indonesia Innovation Award 2021",
    ];

    return (
        <div className="space-y-8">
            {/* Founder Profile */}
            <div>
                <h2 className="text-2xl font-semibold font-ibm">Founder Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {founders.map((f, i) => (
                        <div
                            key={i}
                            className="bg-neutral-100 border border-500 rounded-2xl shadow-sm overflow-hidden"
                        >
                            <div className="px-2 pt-2">
                                <img
                                    src={f.img}
                                    alt={f.name}
                                    className="w-full h-[350px] object-cover rounded-xl"
                                />
                            </div>
                            <div className="p-3">
                                <p className="text-xl font-medium">{f.name}</p>
                                <p className="text-sm text-gray-500">{f.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Achievements */}
            <div className="bg-neutral-100 p-4 rounded-[16px]">
                <h2 className="text-lg font-semibold font-ibm">Key Achievements</h2>
                <div className="mt-3 space-y-2 bg-neutral-50 p-4 rounded-2xl">
                    {achievements.map((a, i) => (
                        <div
                            key={i}
                            className="flex items-center space-x-2 bg-white rounded-xl p-2"
                        >
                            <Award size={20} className="text-yellow-500" />
                            <span className="text-sm">{a}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
