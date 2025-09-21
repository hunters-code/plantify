import { Lock, Banknote, Sparkle, BanknoteArrowDown } from "lucide-react";

export default function FundingStatus() {
    return (
        <div className="bg-neutral-100 p-6 rounded-[16px]">
            <h2 className="text-xl font-semibold mb-4">Funding Status</h2>

            {/* Progress Bar */}
            <div className="mb-6 flex gap-2">
                <Sparkle size={16} />
                <div className="w-full">
                    <div className="flex gap-2 text-sm mb-2">
                        <span className="text-gray-600">
                            Overall Progress: <span className="text-orange-500 font-medium">45% Funded</span>
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-2 w-[45%]" />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-orange-600 font-medium">$22,500</span>
                        <span className="text-gray-500">$50,000</span>
                    </div>
                </div>
            </div>

            {/* Funds Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Funds */}
                <div className="bg-white rounded-xl p-4 flex flex-col justify-between">
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">$32,000</p>
                        <p className="text-gray-500 text-sm">80% of raised funds (ckUSDC)</p>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="mt-4 flex justify-center items-center gap-2 px-4 py-3 
            rounded-xl border border-gray-200 bg-[#F5F5F5] text-sm font-medium text-gray-800
            shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)]
            hover:bg-gray-200 w-fit"
                        >
                            <BanknoteArrowDown size={16} />
                            Request Withdrawal
                        </button>
                    </div>
                </div>

                {/* Platform Reserve */}
                <div className="bg-white rounded-xl p-4 flex flex-col justify-between">
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">$8,000</p>
                        <p className="text-gray-500 text-sm">20% platform reserve (ckUSDC)</p>
                    </div>
                    <div
                        className="mt-4 flex justify-center items-center gap-2 px-4 py-3 
            rounded-xl border border-orange-200 bg-orange-50 text-sm font-medium text-orange-700"
                    >
                        <Lock size={16} />
                        Locked for investor protection
                    </div>
                </div>
            </div>
        </div>
    );
}
