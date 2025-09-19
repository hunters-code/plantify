import { Eye, MapPin, Sparkles, ThumbsUp, WalletCards } from "lucide-react";

export default function StartupOverview() {
  return (
    <div className="bg-neutral-100 rounded-[16px] p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 items-center">
            <h2 className="text-xl font-semibold">EcoFarm Solutions</h2>
            <p className="text-sm text-gray-500 border border-neutral-200 px-2 py-1 rounded-lg flex gap-2"> <MapPin size={16} />Bandung, Indonesia · 12 employees</p>
          </div>
          <div className='flex gap-2'>
            <span className='bg-purple-100 text-purple-700 border border-purple-700 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2'>
              <ThumbsUp size={16} />
              Featured
            </span>
            <span className='bg-green-100 text-green-700 border border-green-700 px-3 py-1 rounded-lg text-xs font-medium'>
              Agriculture
            </span>
            <span className='bg-yellow-100 text-yellow-700 border border-yellow-700 px-3 py-1 rounded-lg text-xs font-medium'>
              Moderate Risk
            </span>
          </div>
        </div>
        <button
          className="flex items-center justify-center gap-1 
             px-4 py-3 
             rounded-xl border border-[#E5E5E5] 
             bg-[#F5F5F5] 
             shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] 
             text-[16px] font-medium text-gray-800"
        >
          <Eye size={16} />
          View Public Page
        </button>
      </div>

      <p className="text-neutral-500 mb-6 bg-white rounded-[16px] p-4 flex flex-col gap-2 text-[16px]">
        <span className="text-black font-ibm">Description</span>
        EcoFarm Solutions develops an integrated hydroponic farming system using IoT technology to
        help farmers boost their yields while preserving the environment.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Funding Progress */}
        <div className="bg-white p-4 rounded-[16px] flex gap-2">
          <Sparkles size={16} />
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">Funding Progress: 45% Funded</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "45%" }} />
            </div>
            <p className="text-sm text-gray-600 mt-1">$22,500 / $50,000</p>
          </div>
        </div>

        {/* NFT Sales */}
        <div className="bg-white p-4 rounded-[16px] flex gap-2">
          <WalletCards size={16} />
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">NFT Sales: 80%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: "80%" }} />
            </div>
            <p className="text-sm text-gray-600 mt-1">80 / 100</p>
          </div>
        </div>
      </div>
    </div>
  );
}
