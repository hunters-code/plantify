import { useState } from "react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Tabs from "../../components/layout/Tabs";
import DashboardOverview from "./partial/DashboardOverview";
import Teams from "./partial/Teams";
import FoundingStatus from "./partial/FoundingStatus";
import StartupOverview from "./partial/StartupOverview";
import { CirclePlus, FileChartLine, FileText, HandCoins, Users } from "lucide-react";

export default function Dashboard() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedCompany, setSelectedCompany] = useState(1);
    const companies = [
        {
            id: 1,
            name: "EcoFarm Solutions",
            logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Eo_circle_green_letter-e.svg",
        },
        {
            id: 2,
            name: "AgriSmart",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Verde.svg",
        },
    ];
    const tabs = [
        { label: "Overview", icon: <FileChartLine size={16} /> },
        { label: "Team", icon: <Users size={16} /> },
        { label: "Funding status", icon: <HandCoins size={16} /> },
        { label: "Monthly reports", content: <div>Reports content</div> },
        { label: "Profit sharing", content: <div>Profit sharing content</div> },
        { label: "Collateral", content: <div>Collateral content</div> },
        { label: "Investors", content: <div>Investors content</div> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return <StartupOverview />;
            case 1:
                return <Teams />;
            case 2:
                return <FoundingStatus />
            default:
                return <StartupOverview />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen text-gray-900">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-semibold mb-6 font-ibm">Dashboard Overview</h1>
                <DashboardOverview />

                <div className="mt-10">
                    <div className="flex justify-between mb-3">
                        <h2 className="text-2xl font-semibold mb-4 font-ibm">Your Startups</h2>
                        <button
                            className="flex items-center justify-center gap-1 px-3 py-3 
               rounded-xl border border-white/20 
               bg-[#7A5AF8] 
               shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] 
               text-white font-medium text-[16px]"
                        >
                            <CirclePlus size={16} />
                            Create new startup
                        </button>
                    </div>

                    <div className="flex items-center w-64 px-3 py-2 gap-4  mb-4
    rounded-xl border border-[#E5E5E5] 
    bg-[#FAFAFA]">
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(Number(e.target.value))}
                            className="flex-1 bg-transparent outline-none text-gray-800 font-medium cursor-pointer text-[16px]"
                        >
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <Tabs tabs={tabs} onChange={setActiveTab} />

                    <div className='rounded-2xl shadow-sm'>{renderContent()}</div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
