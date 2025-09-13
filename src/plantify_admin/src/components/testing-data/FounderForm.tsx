interface FounderFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  previousBusinesses: string;
  expertise: string;
  linkedIn: string;
  idNumber: string;
  taxNumber: string;
}

interface FounderFormProps {
  formData: FounderFormData;
  isGeneratingAI: boolean;
  isRegistering: boolean;
  onInputChange: (field: string, value: string) => void;
  onGenerateAI: () => void;
  onRegister: () => void;
  onNext: () => void;
}

export default function FounderForm({
  formData,
  isGeneratingAI,
  isRegistering,
  onInputChange,
  onGenerateAI,
  onRegister,
  onNext
}: FounderFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Step 1: Create Testing Founder</h3>
        <button
          onClick={onGenerateAI}
          disabled={isGeneratingAI}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          {isGeneratingAI ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Generate with AI</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Founder Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
              placeholder="Enter founder name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Experience (years)</label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => onInputChange('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
              placeholder="Years of experience"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Previous Businesses</label>
            <input
              type="text"
              value={formData.previousBusinesses}
              onChange={(e) => onInputChange('previousBusinesses', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
              placeholder="Previous business experience"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 form-label">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedIn}
              onChange={(e) => onInputChange('linkedIn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
              placeholder="LinkedIn profile URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Expertise</label>
            <textarea
              rows={3}
              value={formData.expertise}
              onChange={(e) => onInputChange('expertise', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
              placeholder="Enter founder expertise and skills"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span>Skip to Startup Creation</span>
        </button>
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          {isRegistering ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Registering...</span>
            </>
          ) : (
            'Register Founder'
          )}
        </button>
      </div>
    </div>
  );
}
