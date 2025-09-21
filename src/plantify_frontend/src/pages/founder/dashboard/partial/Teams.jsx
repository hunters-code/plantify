import { Plus, MoreHorizontal } from "lucide-react";
import { Button, Card } from "../../../../components/ui";

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
                <Button
                    variant='secondary'
                    className="flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add new member
                </Button>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                    <Card
                        key={member.id}
                        className="overflow-hidden"
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
                            <Button
                                variant='secondary'
                                size='sm'
                                className="p-3"
                            >
                                <MoreHorizontal size={18} className="text-gray-600" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
