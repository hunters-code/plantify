"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { backendService } from "../../lib/backend";
import Layout from "../../components/Layout";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalFounders: 0,
    totalInvestors: 0,
    totalStartups: 0,
    totalNFTs: 0,
    totalCollateral: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const loadStats = async () => {
      if (isAuthenticated) {
        try {
          const [nftStats, collateralInfo] = await Promise.all([
            backendService.getNFTStats(),
            backendService.getAllCollateralInfo(),
          ]);

          setStats({
            totalFounders: 0, // Will be updated when we have founder data
            totalInvestors: 0, // Will be updated when we have investor data
            totalStartups: nftStats.totalStartups,
            totalNFTs: nftStats.totalSupply,
            totalCollateral: collateralInfo.length,
          });
        } catch (error) {
          console.error("Failed to load stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadStats();
  }, [isAuthenticated]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const statCards = [
    {
      title: "Total Founders",
      value: stats.totalFounders,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "green",
      gradient: "gradient-primary",
    },
    {
      title: "Active Startups",
      value: stats.totalStartups,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "blue",
      gradient: "gradient-secondary",
    },
    {
      title: "Total NFTs",
      value: stats.totalNFTs,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h4" />
        </svg>
      ),
      color: "purple",
      gradient: "gradient-accent",
    },
    {
      title: "Collateral Pools",
      value: stats.totalCollateral,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: "yellow",
      gradient: "bg-gradient-to-r from-yellow-400 to-orange-500",
    },
  ];

  const actionCards = [
    {
      title: "Create Testing Data",
      description: "Generate founder data, create startups, simulate collateral top-up, and update startup status",
      href: "/testing-data",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "blue",
    },
    {
      title: "Review Startups",
      description: "Review and approve startup applications for the platform",
      href: "/review-startups",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "green",
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Plantify Admin</h2>
              <p className="text-gray-600">Manage your platform and review startup applications</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.gradient} rounded-lg flex items-center justify-center`}>
                  <div className="text-white">{card.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {actionCards.map((card, index) => (
            <div
              key={index}
              onClick={() => router.push(card.href)}
              className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-200 cursor-pointer group border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-${card.color}-50 rounded-lg flex items-center justify-center group-hover:bg-${card.color}-100 transition-colors duration-200`}>
                  <div className={`text-${card.color}-600`}>{card.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{card.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    <span>Get started</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
