import React from "react";
import { CircleDollarSign, Coins } from "lucide-react";

export function StartupCard({
  image,
  title,
  category,
  nftPrice, 
  periodicReturn, 
  fundedText, 
  fundedPct = 0.45, 
  fundedColor = "#22c55e", 
}) {
  return (
    <div className="group rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative h-40 w-full">
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        {/* category pill */}
        {category && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium ring-1 ring-black/10 shadow-sm">
            {category}
          </span>
        )}
        {/* rounded corners mask top only */}
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-ibm text-[15px] sm:text-[16px] font-semibold text-gray-900 leading-tight">
          {title}
        </h3>

        <ul className="mt-3 space-y-1.5 text-[13px] text-gray-700">
          <li className="flex items-center gap-2">
            <Coins size={14} className="text-gray-500" />
            <span className="text-gray-800">NFT Price: {nftPrice}</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleDollarSign size={14} className="text-gray-500" />
            <span className="text-gray-800">Periodic Returns: {periodicReturn}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-gray-800">Funding Progress: {fundedText}</span>
          </li>
        </ul>

        {/* Progress */}
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, fundedPct * 100))}%`, backgroundColor: fundedColor }}
          />
        </div>

        {/* CTA */}
        <div className="mt-4">
          <button
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 text-[13px] font-medium text-gray-900 px-3 py-2 shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] hover:bg-white transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedStartups() {
  const cards = [
    {
      image: "/assets/images/featured/ecofarm.jpg",
      title: "EcoFarm Solutions",
      category: "Agriculture",
      nftPrice: "$75 USD",
      periodicReturn: "$12 USD",
      fundedText: "45% Funded",
      fundedPct: 0.45,
      fundedColor: "#f59e0b", // amber
    },
    {
      image: "/assets/images/featured/smartcafe.jpg",
      title: "SmartCafe Tech",
      category: "Technology",
      nftPrice: "$100 USD",
      periodicReturn: "$18 USD",
      fundedText: "80% Funded",
      fundedPct: 0.8,
      fundedColor: "#22c55e", // green
    },
    {
      image: "/assets/images/featured/urban-chicken.jpg",
      title: "Urban Chicken Farm",
      category: "Livestock",
      nftPrice: "$50 USD",
      periodicReturn: "$8.5 USD",
      fundedText: "32% Funded",
      fundedPct: 0.32,
      fundedColor: "#fb923c", // orange
    },
  ];

  return (
    <section className="relative isolate py-16 sm:py-20 bg-[#1f1f1f]">
      {/* subtle top+bottom fades so it looks cushioned on dark bg */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/0 to-white/0" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-ibm text-2xl sm:text-3xl font-semibold text-white mb-6">
          Featured Startups
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <StartupCard key={c.title} {...c} />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-gray-50">
            {/* small grid icon replacement */}
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gray-900" />
            Explore All Startups
          </button>
        </div>
      </div>
    </section>
  );
}
