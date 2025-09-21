import { Plus, MoreHorizontal } from "lucide-react";

const teamMembers = [
    {
        id: 1,
        name: "Anya Rodriguez",
        role: "CEO & Founder",
        image: "/assets/images/user.png",
    },
    {
        id: 2,
        name: "Marcus Johnson",
        role: "CTO",
        image: "/assets/images/user.png",
    },
    {
        id: 3,
        name: "Lisa Chen",
        role: "Head of Product",
        image: "/assets/images/user.png",
    },
];

export default function TeamSection() {
    return (
        <div className="bg-neutral-100 rounded-[16px] p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 font-ibm">
                    EcoFarm Solutions Team
                </h2>
                <button
                    className="flex justify-center items-center gap-2 px-4 py-3 
  rounded-xl
  bg-[#F5F5F5] 
  text-sm font-medium text-gray-800
  shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)]
  hover:bg-gray-200"
                >
                    <Plus size={16} />
                    Add new member
                </button>

            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="p-2">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-[370px] object-cover rounded-xl"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-gray-900 font-medium text-[16px]">{member.name}</p>
                                <p className="text-gray-500 text-sm">{member.role}</p>
                            </div>
                            <button
                                className="flex justify-center items-center gap-1 p-3
  rounded-xl
  bg-[#F5F5F5] 
  shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] 
  hover:bg-gray-200"
                            >
                                <MoreHorizontal size={18} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
}
