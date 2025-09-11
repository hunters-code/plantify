import React from "react";
import { BadgeDollarSign, Leaf } from "lucide-react";

export function SectorCard({
  image,
  title,
  roi, 
  note, 
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="relative h-44 w-full sm:h-48">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* top highlight */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
      </div>

      {/* Info panel */}
      <div className="p-3">
        <div className="rounded-xl bg-white ring-1 ring-black/5 shadow-sm p-3">
          <h3 className="font-ibm text-[15px] font-semibold text-gray-900 leading-tight">
            {title}
          </h3>

          {/* ROI */}
          <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2 py-1 text-[12px] text-emerald-700">
            <BadgeDollarSign size={14} className="shrink-0" />
            <span className="truncate">{roi}</span>
          </div>

          {/* Note */}
          <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-[12px] text-gray-700">
            <Leaf size={14} className="shrink-0 text-emerald-600" />
            <span className="truncate">{note}</span>
          </div>
        </div>
      </div>

      {/* bottom soft shadow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}

export default function SupportedSectors() {
  const items = [
    {
      title: "Agriculture",
      roi: "15–25% Annual Returns",
      note: "Organic farming, greenhouse",
      image: "/assets/images/sectors/agriculture.jpg",
    },
    {
      title: "Livestock",
      roi: "20–30% Annual Returns",
      note: "Poultry, cattle, aquaculture",
      image: "/assets/images/sectors/livestock.jpg",
    },
    {
      title: "F&B",
      roi: "20–35% Annual Returns",
      note: "Restaurants, catering, food production",
      image: "/assets/images/sectors/fnb.jpg",
    },
    {
      title: "Retail",
      roi: "20–30% Annual Returns",
      note: "Physical stores, e-commerce, distribution",
      image: "/assets/images/sectors/retail.jpg",
    },
    {
      title: "Services",
      roi: "20–35% Annual Returns",
      note: "Workshops, salons, coworking, couriers",
      image: "/assets/images/sectors/services.jpg",
    },
    {
      title: "Technology",
      roi: "40–60% Annual Returns",
      note: "Apps, SaaS, digital services",
      image: "/assets/images/sectors/technology.jpg",
    },
  ];

  return (
    <section className="relative isolate py-16 sm:py-20">
      {/* soft bg */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-ibm text-2xl sm:text-3xl font-semibold text-gray-900">
          Supported Sectors
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <SectorCard key={it.title} {...it} />
          ))}
        </div>
      </div>
    </section>
  );
}
