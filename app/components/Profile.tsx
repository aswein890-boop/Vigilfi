"use client";

import { useState } from "react";

export function Profile({ onProfileComplete }: { onProfileComplete: (profile: any) => void }) {
  const [profileData, setProfileData] = useState({
    filingStatus: "SINGLE",
    state: "CA",
    age: "30",
    dependents: "0",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    onProfileComplete(profileData);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about yourself</h1>
        <p className="text-gray-600">We need this to calculate your taxes accurately.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="filing-status" className="block text-sm font-medium text-gray-700 mb-2">
              Filing Status
            </label>
            <select
              id="filing-status"
              value={profileData.filingStatus}
              onChange={(e) => handleInputChange("filingStatus", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="SINGLE">Single</option>
              <option value="MARRIED_FILING_JOINTLY">Married Filing Jointly</option>
              <option value="MARRIED_FILING_SEPARATELY">Married Filing Separately</option>
              <option value="HEAD_OF_HOUSEHOLD">Head of Household</option>
            </select>
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State (for Taxes)
            </label>
            <input
              id="state"
              type="text"
              value={profileData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., CA"
              maxLength={2}
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Current Age
            </label>
            <input
              id="age"
              type="number"
              value={profileData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="120"
            />
          </div>

          <div>
            <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-2">
              Dependents
            </label>
            <input
              id="dependents"
              type="number"
              value={profileData.dependents}
              onChange={(e) => handleInputChange("dependents", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNextStep}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}
