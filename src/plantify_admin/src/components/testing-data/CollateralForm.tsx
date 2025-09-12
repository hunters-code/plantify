interface Startup {
  id: string;
  startupName?: string;
}

interface CollateralFormProps {
  startups: Startup[];
  selectedStartup: string;
  collateralAmount: string;
  isToppingUp: boolean;
  onStartupChange: (startupId: string) => void;
  onAmountChange: (amount: string) => void;
  onTopUp: () => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CollateralForm({
  startups,
  selectedStartup,
  collateralAmount,
  isToppingUp,
  onStartupChange,
  onAmountChange,
  onTopUp,
  onNext,
  onBack
}: CollateralFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Step 3: Top Up Collateral</h3>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Startup Creation</span>
        </button>
      </div>
      
      <div className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Startup</label>
          <select
            value={selectedStartup}
            onChange={(e) => onStartupChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select a startup</option>
            {startups.map((startup, index) => (
              <option key={index} value={startup.id}>
                {startup.id || "Unknown Startup"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Collateral Amount (ckUSDC)</label>
          <input
            type="number"
            value={collateralAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter collateral amount"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onNext}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span>Skip to Status Update</span>
        </button>
        <button
          onClick={onTopUp}
          disabled={isToppingUp}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          {isToppingUp ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Topping Up...</span>
            </>
          ) : (
            'Top Up Collateral'
          )}
        </button>
      </div>
    </div>
  );
}
