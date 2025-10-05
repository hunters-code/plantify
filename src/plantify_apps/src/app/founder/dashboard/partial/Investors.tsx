"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { Badge, Button, Card, CardSkeleton } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/utils/formatCurrency";

function useInvestors(startupId?: number) {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const investors = [
    {
      fullName: "Alice Johnson",
      principal: "0xA1B2C3D4E5",
      totalInvestment: 5200,
      participation: 85,
      nftsOwned: 5,
      profitReceived: 340,
      location: "New York, USA",
      badges: ["VIP", "Active"],
    },
    {
      fullName: "Bob Lee",
      principal: "0x12345ABCDEF",
      totalInvestment: 2500,
      participation: 60,
      nftsOwned: 3,
      profitReceived: 200,
      location: "London, UK",
      badges: ["Active"],
    },
    {
      fullName: "Catherine Nguyen",
      principal: "0x9F8E7D6C5B",
      totalInvestment: 700,
      participation: 40,
      nftsOwned: 1,
      profitReceived: 50,
      location: "Singapore",
      badges: ["Inactive"],
    },
  ];

  return {
    investors,
    totalInvestment: investors.reduce((s, i) => s + i.totalInvestment, 0),
    totalInvestors: investors.length,
    activeInvestors: investors.filter((i) => i.participation > 50).length,
    vipInvestors: investors.filter((i) => i.totalInvestment > 5000).length,
    averageParticipation:
      investors.reduce((s, i) => s + i.participation, 0) / investors.length,
    loading,
    error,
  };
}

interface InvestorsProps {
  startupId?: number;
}

export default function Investors({ startupId }: InvestorsProps) {
  const {
    investors,
    totalInvestment,
    totalInvestors,
    activeInvestors,
    vipInvestors,
    averageParticipation,
    loading,
    error,
  } = useInvestors(startupId);

  const [activeInvestorTab, setActiveInvestorTab] = useState(0);

  const investorTabs = [
    { label: "Overview" },
    { label: "Investor list" },
    { label: "Analytics" },
    { label: "Engagement" },
  ];

  const getBadgeVariant = (badge: string) => {
    if (badge.includes("VIP")) return "primary";
    if (badge.includes("Active")) return "success";
    if (badge.includes("Inactive")) return "warning";
    return "secondary";
  };

  if (loading) return <CardSkeleton textRows={4} withImage />;

  if (error)
    return (
      <Card className="bg-red-50 border border-red-200 p-6 text-center">
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Investors
          </h2>
          <p>{error}</p>
        </div>
      </Card>
    );

  if (!startupId)
    return (
      <Card className="bg-neutral-100 p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">No Startup Selected</h2>
        <p className="text-gray-500">
          Please select a startup from the dropdown above.
        </p>
      </Card>
    );

  return (
    <Card className="bg-neutral-100">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Investors</h2>
          <p className="text-sm text-gray-500">
            {formatCurrency(totalInvestment)} (
            {formatNumber(averageParticipation, 1)}% avg participation)
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          <Badge variant="success" className="ml-2">
            Active
          </Badge>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(totalInvestment)}
          </div>
          <div className="text-sm text-gray-500">Total investment</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalInvestors}
          </div>
          <div className="text-sm text-gray-500">Total investors</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {activeInvestors}
          </div>
          <div className="text-sm text-gray-500">Active investors</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {vipInvestors}
          </div>
          <div className="text-sm text-gray-500">VIP investors</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatNumber(averageParticipation, 1)}%
          </div>
          <div className="text-sm text-gray-500">Avg Participation</div>
        </Card>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search investors by name or wallet address"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <Button variant="secondary">
          <Filter size={16} />
          Filters
        </Button>
      </div>

      {/* TAB NAVIGATION */}
      <div className="mb-4 border-b border-gray-200 flex">
        {investorTabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveInvestorTab(index)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeInvestorTab === index
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 0 — OVERVIEW */}
      {activeInvestorTab === 0 && (
        <div className="space-y-6">
          <h4 className="text-sm font-semibold mb-4">Top Investors</h4>
          <div className="space-y-3">
            {investors.map((investor, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between"
              >
                <div>
                  <span className="font-medium">
                    #{index + 1} {investor.fullName}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {investor.badges.map((badge, badgeIndex) => (
                      <Badge
                        key={badgeIndex}
                        variant={getBadgeVariant(badge)}
                        size="sm"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">
                    {formatCurrency(investor.totalInvestment)}
                  </div>
                  <div className="text-gray-500">
                    {investor.participation}% participation
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1 — INVESTOR LIST */}
      {activeInvestorTab === 1 && (
        <div className="space-y-4">
          {investors.map((investor, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h5 className="font-medium">{investor.fullName}</h5>
                  <p className="text-sm text-gray-500">
                    {investor.principal.slice(0, 10)}...
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">
                    <Eye size={14} />
                    View
                  </Button>
                  <Button variant="secondary">
                    <MessageCircle size={14} />
                    Message
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Investment:</span>
                  <div className="font-medium">
                    {formatCurrency(investor.totalInvestment)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">NFTs owned:</span>
                  <div className="font-medium">{investor.nftsOwned}</div>
                </div>
                <div>
                  <span className="text-gray-500">Profit received:</span>
                  <div className="font-medium">
                    {formatCurrency(investor.profitReceived)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Participation:</span>
                  <div className="font-medium">
                    {investor.participation}%
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                <MapPin size={18} /> {investor.location}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
