import React from 'react';
import phygenLogo from '../assets/icons/phygen-logo.png';
import googleIcon from '../assets/icons/google-icon.png';
import facebookIcon from '../assets/icons/facebook-icon.png';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-[#f5f9ff] flex flex-col items-center justify-center">
      {/* Logo & Heading */}
      <div className="flex flex-col items-center mb-6">
        <img src={phygenLogo} alt="PhyGen Logo" className="w-26 h-26 mb-2" />
        <h2 className="text-2xl font-semibold text-blue-700">Sign in</h2>
      </div>

      {/* Form box */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md px-6 py-6">
        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="Your email address, phone or username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition font-medium text-sm"
          >
            Sign in
          </button>
        </form>

        {/* Social buttons */}
        <div className="space-y-2 mt-4">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition text-sm">
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition text-sm">
            <img src={facebookIcon} alt="Facebook" className="w-5 h-5" />
            Continue with Facebook
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account? <a href="#" className="text-blue-700 hover:underline">Sign up</a>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs">
        <a href="#" className="text-blue-700 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
};

export default SignIn;