import { useState } from 'react';
import Layout from '../../../components/layout/Layout';

export default function CreateStartupPage() {
  const [formData, setFormData] = useState({
    startupName: '',
    description: '',
    sector: '',
    businessModel: '',
    targetMarket: '',
    fundingGoal: '',
    equityOffering: '',
    problemStatement: '',
    solution: '',
    revenueModel: '',
    website: '',
    location: '',
    foundedYear: '',
    teamSize: '',
    monthlyRevenue: '',
    monthlyExpenses: '',
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
        <div className='max-w-4xl mx-auto px-4'>
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
              Create Your Startup
            </h1>

            <form onSubmit={handleSubmit} className='space-y-8'>
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 border-b pb-2'>
                  Basic Information
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Startup Name
                    </label>
                    <input
                      type='text'
                      name='startupName'
                      value={formData.startupName}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Sector
                    </label>
                    <select
                      name='sector'
                      value={formData.sector}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    >
                      <option value=''>Select sector</option>
                      <option value='fintech'>Fintech</option>
                      <option value='healthtech'>Healthtech</option>
                      <option value='edtech'>Edtech</option>
                      <option value='ecommerce'>E-commerce</option>
                      <option value='saas'>SaaS</option>
                      <option value='ai'>Artificial Intelligence</option>
                      <option value='blockchain'>Blockchain</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Location
                    </label>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Founded Year
                    </label>
                    <input
                      type='number'
                      name='foundedYear'
                      value={formData.foundedYear}
                      onChange={handleChange}
                      min='2000'
                      max='2024'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Describe your startup and what makes it unique...'
                    required
                  />
                </div>
              </div>

              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 border-b pb-2'>
                  Business Details
                </h2>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Problem Statement
                  </label>
                  <textarea
                    name='problemStatement'
                    value={formData.problemStatement}
                    onChange={handleChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='What problem does your startup solve?'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Solution
                  </label>
                  <textarea
                    name='solution'
                    value={formData.solution}
                    onChange={handleChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='How does your startup solve this problem?'
                    required
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Business Model
                    </label>
                    <textarea
                      name='businessModel'
                      value={formData.businessModel}
                      onChange={handleChange}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='How does your startup make money?'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Target Market
                    </label>
                    <textarea
                      name='targetMarket'
                      value={formData.targetMarket}
                      onChange={handleChange}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Who are your target customers?'
                      required
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 border-b pb-2'>
                  Funding Information
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Funding Goal ($)
                    </label>
                    <input
                      type='number'
                      name='fundingGoal'
                      value={formData.fundingGoal}
                      onChange={handleChange}
                      min='0'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Equity Offering (%)
                    </label>
                    <input
                      type='number'
                      name='equityOffering'
                      value={formData.equityOffering}
                      onChange={handleChange}
                      min='0'
                      max='100'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Team Size
                    </label>
                    <input
                      type='number'
                      name='teamSize'
                      value={formData.teamSize}
                      onChange={handleChange}
                      min='1'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Monthly Revenue ($)
                    </label>
                    <input
                      type='number'
                      name='monthlyRevenue'
                      value={formData.monthlyRevenue}
                      onChange={handleChange}
                      min='0'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Monthly Expenses ($)
                    </label>
                    <input
                      type='number'
                      name='monthlyExpenses'
                      value={formData.monthlyExpenses}
                      onChange={handleChange}
                      min='0'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Website
                  </label>
                  <input
                    type='url'
                    name='website'
                    value={formData.website}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='https://yourstartup.com'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  className='px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200'
                >
                  Save Draft
                </button>
                <button
                  type='submit'
                  className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200'
                >
                  Create Startup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
