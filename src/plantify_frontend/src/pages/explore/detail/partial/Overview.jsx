import { TrendingUp } from "lucide-react";

export default function Overview() {
    return (
        <div className="bg-neutral-100 p-4 rounded-lg">
            {/* Company Overview */}
            <div>
                <h2 className="text-xl font-semibold font-ibm">Company Overview</h2>
                <p className="text-gray-600 text-sm mt-2">
                    EcoFarm Solutions develops an integrated hydroponic farming system
                    using IoT technology to help farmers boost their yields while preserving the environment.
                </p>
            </div>

            {/* Business Model */}
            <div>
                <h3 className="text-lg font-medium font-ibm">Business Model</h3>
                <p className="text-gray-600 text-sm">
                    A B2B2C hybrid model – selling hydroponic systems to farmers and
                    organic produce to consumers.
                </p>
            </div>

            {/* Competitive Advantage */}
            <div>
                <h3 className="text-lg font-medium font-ibm">Competitive Advantage</h3>
                <ul className="mt-2 space-y-2">
                    {[
                        "Proprietary IoT technology for plant monitoring.",
                        "Patented organic nutrient system.",
                        "Strategic partnerships with over 50 local farmers.",
                        "R&D team with over 15 years of experience.",
                    ].map((item, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm"
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Metrics */}
            <div>
                <h3 className="text-lg font-medium font-ibm">Key Business Metrics</h3>
                <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Monthly Revenue</p>
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-semibold font-ibm">$14,500</p>
                            <span className="text-sm text-green-600 font-medium bg-green-100 border-2 border-green-200 px-2 py-1 rounded-lg flex gap-1 items-center">
                                <div className="bg-green-600 rounded-full w-fit p-1">
                                    <TrendingUp size={15} className="text-white" />
                                </div>
                                +18.5%
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Net Profit Margin</p>
                        <p className="text-xl font-semibold font-ibm">32.1%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total Customers</p>
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-semibold font-ibm">186</p>
                            <span className="text-sm text-green-600 font-medium bg-green-100 border-2 border-green-200 px-2 py-1 rounded-lg flex gap-1 items-center">
                                <div className="bg-green-600 rounded-full w-fit p-1">
                                    <TrendingUp size={15} className="text-white" />
                                </div>
                                +22%
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Average Order Value</p>
                        <p className="text-xl font-semibold font-ibm">$78</p>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div>
                <h3 className="text-lg font-medium font-ibm">Products & Services</h3>
                <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium">EcoGrow System</h4>
                        <p className="text-sm text-gray-600">
                            Complete hydroponic setup with IoT monitoring
                        </p>
                        <p className="text-sm font-semibold mt-2 font-ibm">$1,500</p>
                        <p className="text-xs text-gray-500">Customers: 45</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium">Smart Nutrient Mix</h4>
                        <p className="text-sm text-gray-600">
                            Organic nutrient solution subscription
                        </p>
                        <p className="text-sm font-semibold mt-2 font-ibm">$30 /month</p>
                        <p className="text-xs text-gray-500">Customers: 78</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
