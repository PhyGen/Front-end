import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DataDeletion = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Gửi yêu cầu xóa dữ liệu đến server của bạn
      // Đây chỉ là mẫu, bạn cần thay thế bằng API call thực tế
      await new Promise(resolve => setTimeout(resolve, 1500)); // Giả lập API call
      
      setMessage('Your data deletion request has been submitted successfully. We will process it within 30 days.');
    } catch (error) {
      setMessage('An error occurred while submitting your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Deletion Request</h1>

        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">How to Delete Your Data</h2>
            <p className="mb-4">
              You can request the deletion of your personal data from PhyGen. Please note that:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>This process cannot be undone</li>
              <li>It may take up to 30 days to complete the deletion</li>
              <li>Some data may be retained for legal purposes</li>
              <li>Your account will be permanently deactivated</li>
            </ul>
          </section>

          {user ? (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800">
                  You are requesting data deletion for account: <strong>{user.email}</strong>
                </p>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  id="confirm"
                  className="mt-1"
                />
                <label htmlFor="confirm" className="ml-2 text-sm">
                  I understand that this action cannot be undone and all my data will be permanently deleted
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Request Data Deletion'}
              </button>

              {message && (
                <div className={`mt-4 p-4 rounded-md ${
                  message.includes('successfully') 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  {message}
                </div>
              )}
            </form>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800">
                Please sign in to request data deletion.{' '}
                <Link to="/signin" className="text-blue-600 hover:text-blue-800 underline">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion; 