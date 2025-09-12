"use client";

import { Funnel, ListFilter, Search } from "lucide-react";
import { Navbar, ProductCard, Pagination, WhyPlantify, Footer } from "../../components";

export default function Explores() {
  const startups = [
    {
      image: "/assets/images/product.png",
      title: "EcoFarm Solutions",
      location: "Bandung, Indonesia",
      employees: 12,
      category: "Agriculture",
      risk: "Moderate Risk",
      description:
        "Revolutionary organic farming solutions using sustainable technology to maximize crop yield.",
      nftPrice: 75,
      periodicReturns: "$12",
      annualROI: 19.2,
      available: 167,
      fundingProgress: 45,
      fundedAmount: 22500,
      targetAmount: 50000,
    },
    {
      image: "/assets/images/product.png",
      title: "SmartCafe Tech",
      location: "Jakarta, Indonesia",
      employees: 18,
      category: "Technology",
      risk: "High Risk",
      description:
        "Innovative cafe management platform that combines IoT technology with AI-powered analytics.",
      nftPrice: 100,
      periodicReturns: "$18",
      annualROI: 21.6,
      available: 150,
      fundingProgress: 80,
      fundedAmount: 60000,
      targetAmount: 75000,
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 mb-32">
        <h1 className="text-3xl font-ibm">All Startups</h1>
        <p className="text-gray-600 text-sm mb-6">
          Discover investment opportunities across various sectors and risk
          levels
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div
            className="flex items-center gap-1 w-[450px] px-4 py-3 
                rounded-xl border border-gray-200 bg-white 
                shadow-md">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, sector, location, or tags..."
              className="flex-1 outline-none text-sm placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center gap-4 
             px-4 py-3 
             rounded-xl border border-gray-200 
             bg-gray-100 
             text-sm font-medium 
             shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] 
             hover:bg-gray-200">
              <Funnel size={20} /> Filters
            </button>
            <button
              className="flex items-center justify-center gap-4 
             px-4 py-3 
             rounded-xl border border-gray-200 
             bg-gray-100 
             text-sm font-medium 
             shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] 
             hover:bg-gray-200">
              <ListFilter size={20} /> Filters
            </button>
          </div>
        </div>

        <hr />

        <div className="flex items-center gap-3 mb-8 mt-8">
          <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50">
            All Startups
            <span className="ml-1 bg-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              16
            </span>
          </button>
          <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50">
            Available
            <span className="ml-1 bg-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              16
            </span>
          </button>
          <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50">
            Featured
            <span className="ml-1 bg-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup, index) => (
            <ProductCard key={index} {...startup} />
          ))}
        </div>

        <Pagination />
      </div>

      <div className="mb-12">
        <WhyPlantify withoutCta />
      </div>
      <Footer />
    </div>
  );
}
