import React from "react";
import { ShieldCheck, Eye, Users, Network, DollarSign, DoorOpen } from "lucide-react";
import Button from "./Button";

const features = [
  {
    icon: <ShieldCheck size={18} />,
    title: "Triple Protection",
    desc: "Founder collateral, platform reserves, and community governance.",
  },
  {
    icon: <Eye size={18} />,
    title: "Complete Transparency",
    desc: "On-chain transactions with public reporting.",
  },
  {
    icon: <Users size={18} />,
    title: "Community Driven",
    desc: "Monthly voting with transparent governance.",
  },
  {
    icon: <Network size={18} />,
    title: "Fully Decentralized",
    desc: "Built on the Internet Computer blockchain.",
  },
  {
    icon: <DollarSign size={18} />,
    title: "Stable Currency",
    desc: "All transactions in ckUSDC ensure predictable returns.",
  },
  {
    icon: <DoorOpen size={18} />,
    title: "Low Entry Barrier",
    desc: "Start investing with just $50 per NFT.",
  },
];

export default function WhyPlantify() {
  return (
    <section className="relative isolate">
      {/* ===== Title ===== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10">
        <h2 className="text-center font-ibm text-2xl sm:text-3xl font-semibold text-gray-900">
          Why Plantify?
        </h2>
      </div>

      {/* ===== Feature grid on background ===== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-6">
        <div
          className="relative rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden p-24"
          style={{
            backgroundImage: "url(/assets/images/house.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* sky-to-glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-white/10" />

          {/* subtle bottom shadow for depth */}
          <div className="pointer-events-none absolute inset-x-6 bottom-0 h-8 rounded-t-[24px] bg-black/10 blur-[6px]" />

          <div className="relative p-3 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 rounded-xl bg-white/90 backdrop-blur-sm px-4 py-3 shadow-sm ring-1 ring-black/5"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    {f.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-geist text-[15px] font-semibold text-gray-900 leading-tight">
                      {f.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-gray-600 leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CTA Banner ===== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10 mb-12">
        <div
          className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5"
          style={{
            backgroundImage: "url(/assets/images/bg-cta.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* White fade from top to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/5" />

          <div className="relative px-6 sm:px-10 py-10 sm:py-14 text-center">
            {/* small decorative glyph */}
            <div className="mx-auto mb-4 h-6 w-6 rounded-md bg-violet-500" />

            <h3 className="font-ibm text-[28px] sm:text-[32px] text-gray-900">Ready to Start?</h3>
            <p className="mt-1 text-[13px] sm:text-sm text-gray-700">
              Join thousands of investors earning stable returns from startup
            </p>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button as="a" href="#invest" variant="primary" className="px-4">
                Start Investing
              </Button>
              <Button as="a" href="#register" variant="secondary" className="px-4">
                Register Startup
              </Button>
            </div>
          </div>

          {/* dark fade at bottom for depth */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent" />
        </div>
      </div>
    </section>
  );
}
