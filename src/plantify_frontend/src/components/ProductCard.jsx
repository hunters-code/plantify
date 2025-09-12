"use client";

import {
  BadgeDollarSign,
  TrendingUp,
  Leaf,
  Users,
  BanknoteArrowUp,
  Eye,
  ThumbsUp,
  MapPin,
} from "lucide-react";

export default function ProductCard({
  image,
  title,
  location,
  employees,
  category,
  risk,
  description,
  nftPrice,
  periodicReturns,
  annualROI,
  available,
  fundingProgress,
  fundedAmount,
  targetAmount,
}) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      {/* Image */}
      <div className="relative h-60 w-full">
        <img src={image} alt={title} className="h-full w-full object-cover" />

        {/* Category & Risk badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-lg shadow">
            <ThumbsUp size={15} className="text-purple-600" />
          </span>
          <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-lg shadow">
            {category}
          </span>
          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-lg shadow">
            {risk}
          </span>
        </div>

        {/* Location overlay */}
        <div className="absolute bottom-2 left-2 bg-white text-neutral-500 text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
          <MapPin size={12} />
          {location} • {employees} employees
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Desc */}
        <h3 className="font-normal text-gray-900 text-[20px] font-ibm">{title}</h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2 font-geist">{description}</p>

        <div className="mt-3 text-[13px] space-y-1 text-gray-700 font-geist">
          <p>
            <BadgeDollarSign
              className="inline mr-1 text-neutral-500"
              size={14}
            />
            NFT Price: ${nftPrice} ckUSDC
          </p>
          <p>
            <TrendingUp className="inline mr-1 text-neutral-500" size={14} />
            Periodic Returns: {periodicReturns}
          </p>
          <p>
            <Leaf className="inline mr-1 text-neutral-500" size={14} />
            Annual ROI: {annualROI}%
          </p>
          <p>
            <Users className="inline mr-1 text-neutral-500" size={14} />
            Available: {available} NFT
          </p>
        </div>

        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-orange-400 rounded-full"
              style={{ width: `${fundingProgress}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-orange-600 font-medium">
            Funding Progress: {fundingProgress}% Funded
          </p>
        </div>

        <div className="mt-2 text-sm font-semibold">
          <span className="text-orange-600">
            ${fundedAmount.toLocaleString()}
          </span>{" "}
          <span className="text-gray-400">
            / ${targetAmount.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-[6px] 
             rounded-[12px] border border-[#E5E5E5] 
             bg-[#F5F5F5] text-xs font-medium text-gray-900 
             px-4 py-3 
             shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] 
             hover:bg-gray-100 transition">
            <Eye size={20} /> Details
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-[6px] rounded-[12px] border border-white/20 
             bg-[#7A5AF8] text-white text-xs font-medium px-4 py-3 
             shadow-[0_2px_4px_0_rgba(0,0,0,0.16),inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25)] 
             hover:bg-[#6945e6] transition">
            <BanknoteArrowUp size={20} /> Invest
          </button>
        </div>
      </div>
    </div>
  );
}
