import React from 'react';

import { Card } from '@/components/ui';

interface KnowladgeAssessmentProps {
  formData: Record<string, boolean>;
  handleInputChange?: (field: string, value: boolean) => void;
}

interface CheckboxItem {
  field: string;
  title: string;
  description: string;
}

export default function KnowladgeAssessment({
  formData,
  handleInputChange,
}: KnowladgeAssessmentProps) {
  const handleChange = (field: string, value: boolean) => {
    if (handleInputChange) {
      handleInputChange(field, value);
    }
  };

  const checkboxItems: CheckboxItem[] = [
    {
      field: 'investmentRisks',
      title: 'I understand investment risks',
      description:
        'Startup investments are high-risk and I may lose some or all of my investment. Returns are not guaranteed and depend on startup performance.',
    },
    {
      field: 'nftModel',
      title: 'I understand NFT investment model',
      description:
        'Each NFT represents profit sharing rights in a specific startup. Profit sharing is distributed monthly based on startup performance and community voting.',
    },
    {
      field: 'governance',
      title: 'I understand community governance',
      description:
        'I must participate in monthly voting to approve/reject startup progress reports. My vote affects whether profit sharing is distributed that month.',
    },
    {
      field: 'liquidity',
      title: 'I understand liquidity restrictions',
      description:
        'NFTs are locked for 36 months and cannot be sold or transferred. I will not have access to my initial investment capital during this period.',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 font-ibm">
        Knowladge Assessment
      </h2>

      <div className="space-y-4">
        {checkboxItems.map((item) => (
          <Card
            key={item.field}
            className={`flex items-start gap-3 p-4 cursor-pointer transition-all duration-200 ${formData[item.field]
              ? 'border-blue-500 bg-blue-50'
              : 'border-neutral-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handleChange(item.field, !formData[item.field])}
          >
            <input
              type="checkbox"
              checked={formData[item.field] || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(item.field, e.target.checked)
              }
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-gray-900 text-[16px]">
                {item.title}
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
