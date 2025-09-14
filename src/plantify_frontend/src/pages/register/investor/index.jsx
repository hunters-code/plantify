import { useState } from 'react';
import Layout from '../../../components/layout/Layout';

export default function InvestorRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    investmentExperience: '',
    riskTolerance: '',
    investmentGoals: '',
    availableCapital: '',
    monthlyBudget: '',
  });

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='max-w-2xl mx-auto px-4'>
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
              Investor Registration
            </h1>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Country
                  </label>
                  <input
                    type='text'
                    name='country'
                    value={formData.country}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    City
                  </label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Investment Experience
                  </label>
                  <select
                    name='investmentExperience'
                    value={formData.investmentExperience}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  >
                    <option value=''>Select experience level</option>
                    <option value='beginner'>Beginner (0-2 years)</option>
                    <option value='intermediate'>
                      Intermediate (2-5 years)
                    </option>
                    <option value='advanced'>Advanced (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Risk Tolerance
                  </label>
                  <select
                    name='riskTolerance'
                    value={formData.riskTolerance}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  >
                    <option value=''>Select risk tolerance</option>
                    <option value='conservative'>Conservative</option>
                    <option value='moderate'>Moderate</option>
                    <option value='aggressive'>Aggressive</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Available Capital
                  </label>
                  <input
                    type='text'
                    name='availableCapital'
                    value={formData.availableCapital}
                    onChange={handleChange}
                    placeholder='e.g., $10,000 - $50,000'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Monthly Budget
                  </label>
                  <input
                    type='text'
                    name='monthlyBudget'
                    value={formData.monthlyBudget}
                    onChange={handleChange}
                    placeholder='e.g., $1,000 - $5,000'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Investment Goals
                </label>
                <textarea
                  name='investmentGoals'
                  value={formData.investmentGoals}
                  onChange={handleChange}
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder="Describe your investment goals and what you're looking for in startups..."
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200'
              >
                Register as Investor
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
