import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ExploreDetail() {
    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side (Images) */}
                <div>
                    {/* Main Image */}
                    <div className="rounded-xl overflow-hidden shadow-md">
                        <img
                            src="/assets/images/product.png"
                            alt="Product"
                            width={600}
                            height={400}
                            className="object-cover w-full h-[350px]"
                        />
                    </div>

                    {/* Thumbnail List */}
                    <div className="flex gap-3 mt-4">
                        {Array(4)
                            .fill(null)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="w-20 h-20 rounded-lg overflow-hidden shadow cursor-pointer"
                                >
                                    <img
                                        src="/assets/images/product.png"
                                        alt="Thumbnail"
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}

                        <div className="w-20 h-20 rounded-lg bg-purple-600 flex items-center justify-center text-white font-medium cursor-pointer">
                            View More
                        </div>
                    </div>
                </div>

                {/* Right Side (Detail Card) */}
                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
                    {/* Tags */}
                    <div className="flex gap-2">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            Agriculture
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                            Moderate Risk
                        </span>
                    </div>

                    {/* Title & Desc */}
                    <div className="flex gap-3">
                        <div>
                            <img
                                src="/assets/images/icon-startup.png"
                                className="w-8 h-8"
                            />
                        </div>
                        <h2 className="text-2xl font-semibold font-ibm">EcoFarm Solutions</h2>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Revolutionary organic farming solutions using sustainable technology
                        to maximize crop yields while maintaining environmental balance.
                    </p>
                    <p className="text-sm text-gray-500">
                        📍 Bandung, Indonesia · 12 employees
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 text-sm">
                        <p>📈 Periodic Returns: <span className="font-semibold">$12</span></p>
                        <p>💹 Annual ROI: <span className="font-semibold">19.2%</span></p>
                        <p>🔑 Available: <span className="font-semibold">167 NFT</span></p>
                        <p>
                            📊 Funding Progress:{" "}
                            <span className="text-orange-500 font-semibold">45% Funded</span>
                        </p>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="bg-orange-500 h-2 rounded-full w-[45%]" />
                        </div>
                    </div>

                    {/* Target */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-orange-600 font-semibold">$22,500</span>
                        <span className="text-gray-400">$50,000</span>
                    </div>

                    {/* NFT Price */}
                    <div className="text-sm">
                        NFT Price:{" "}
                        <span className="font-semibold">$75 cKUSDC</span>
                    </div>

                    {/* Button */}
                    <button className="mt-4 w-full flex justify-center items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-xl shadow hover:opacity-90 transition">
                        Invest Now
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
