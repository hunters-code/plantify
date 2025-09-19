import { useState } from "react";

export default function KnowladgeAssessment({ formData, handleInputChange }) {
  const handleChange = (field, value) => {
    if (handleInputChange) {
      handleInputChange(field, value);
    }
  };

  const checkboxStyle = `
    flex items-start gap-3 p-4 rounded-xl border 
    border-neutral-200 bg-white shadow-sm cursor-pointer 
    hover:border-gray-300 transition-all duration-200
  `;

  const labelStyle = `
    font-medium text-gray-900 text-[16px]
  `;

  const descriptionStyle = `
    text-sm text-gray-600
  `;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 font-ibm">
        Verification Documents
      </h2>

      <div className="space-y-4">
        {/* Investment Risks */}
        <label className={checkboxStyle}>
          <input
            type="checkbox"
            checked={formData.investmentRisks || false}
            onChange={(e) => handleChange("investmentRisks", e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <div className={labelStyle}>I understand investment risks</div>
            <p className={descriptionStyle}>
              Startup investments are high-risk and I may lose some or all of my
              investment. Returns are not guaranteed and depend on startup
              performance.
            </p>
          </div>
        </label>

        {/* NFT Investment Model */}
        <label className={checkboxStyle}>
          <input
            type="checkbox"
            checked={formData.nftModel || false}
            onChange={(e) => handleChange("nftModel", e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <div className={labelStyle}>I understand NFT investment model</div>
            <p className={descriptionStyle}>
              Each NFT represents profit sharing rights in a specific startup.
              Profit sharing is distributed monthly based on startup performance
              and community voting.
            </p>
          </div>
        </label>

        {/* Community Governance */}
        <label className={checkboxStyle}>
          <input
            type="checkbox"
            checked={formData.governance || false}
            onChange={(e) => handleChange("governance", e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <div className={labelStyle}>
              I understand community governance
            </div>
            <p className={descriptionStyle}>
              I must participate in monthly voting to approve/reject startup
              progress reports. My vote affects whether profit sharing is
              distributed that month.
            </p>
          </div>
        </label>

        {/* Liquidity Restrictions */}
        <label className={checkboxStyle}>
          <input
            type="checkbox"
            checked={formData.liquidity || false}
            onChange={(e) => handleChange("liquidity", e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <div className={labelStyle}>
              I understand liquidity restrictions
            </div>
            <p className={descriptionStyle}>
              NFTs are locked for 36 months and cannot be sold or transferred. I
              will not have access to my initial investment capital during this
              period.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
