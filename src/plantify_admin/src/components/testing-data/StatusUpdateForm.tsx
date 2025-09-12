interface Startup {
  id: string;
  startupName?: string;
  status?: string;
  description?: string;
  sector?: string;
}

interface StatusUpdateFormProps {
  startups: Startup[];
  selectedStartup: string;
  newStatus: string;
  isUpdatingStatus: boolean;
  onStartupChange: (startupId: string) => void;
  onStatusChange: (status: string) => void;
  onUpdate: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

export default function StatusUpdateForm({
  startups,
  selectedStartup,
  newStatus,
  isUpdatingStatus,
  onStartupChange,
  onStatusChange,
  onUpdate,
  onBack,
  onStartOver
}: StatusUpdateFormProps) {
  const selectedStartupData = startups.find(startup => startup.id === selectedStartup);

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">Step 4: Update Startup Status</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Mainnet
          </span>
        </div>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Collateral</span>
        </button>
      </div>
      
      <div className="max-w-2xl space-y-6">
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
                {startup.startupName || startup.id || "Unknown Startup"}
              </option>
            ))}
          </select>
        </div>

        {selectedStartupData && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Startup Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{selectedStartupData.startupName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedStartupData.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  selectedStartupData.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  selectedStartupData.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedStartupData.status || 'pending'}
                </span>
              </div>
              {selectedStartupData.sector && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sector:</span>
                  <span className="font-medium">{selectedStartupData.sector}</span>
                </div>
              )}
              {selectedStartupData.description && (
                <div>
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-900">{selectedStartupData.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
          <select
            value={newStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={!selectedStartup}
          >
            <option value="">Select new status</option>
            {selectedStartupData && selectedStartupData.status !== 'Pending' && (
              <option value="Pending">Pending</option>
            )}
            {selectedStartupData && selectedStartupData.status !== 'Approved' && (
              <option value="Approved">Approved</option>
            )}
            {selectedStartupData && selectedStartupData.status !== 'Rejected' && (
              <option value="Rejected">Rejected</option>
            )}
            {selectedStartupData && selectedStartupData.status !== 'Active' && (
              <option value="Active">Active</option>
            )}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {selectedStartup ? 
              "This will update the startup status in the mainnet backend" :
              "Please select a startup first"
            }
          </p>
          {newStatus === 'Active' && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-blue-800">NFT Auto-Minting</p>
                  <p className="text-xs text-blue-700 mt-1">
                    When set to active, an NFT will be automatically minted for this startup with metadata including company details and logo.
                  </p>
                </div>
              </div>
            </div>
          )}
          {selectedStartupData && selectedStartupData.status === newStatus && (
            <p className="mt-1 text-xs text-amber-600">
              ⚠️ Selected status is the same as current status
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onStartOver}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Start Over</span>
        </button>
        <button
          onClick={onUpdate}
          disabled={isUpdatingStatus || !selectedStartup || !newStatus || (selectedStartupData && selectedStartupData.status === newStatus)}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          {isUpdatingStatus ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Updating...</span>
            </>
          ) : (
            'Update Status'
          )}
        </button>
      </div>
    </div>
  );
}
