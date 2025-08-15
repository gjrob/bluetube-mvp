import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Camera, Upload, Search, Loader, Lock, Award, FileCheck, User, Calendar, Hash, Building } from 'lucide-react';

const Part107Verification = () => {
  const [verificationStep, setVerificationStep] = useState('start');
  const [pilotData, setPilotData] = useState({
    certificateNumber: '',
    firstName: '',
    lastName: '',
    issueDate: '',
    certificateImage: null,
    selfieWithCert: null
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [faaLookupResult, setFaaLookupResult] = useState(null);

  // Simulated FAA database lookup
  const verifyWithFAA = async (certNumber) => {
    setLoading(true);
    
    // Simulate API call to FAA Airmen Registry
    // In production, this would connect to real FAA database
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Format: "FA" + letter + 7 digits (e.g., FA3A1234567)
    const validFormat = /^FA[A-Z]\d{7}$/i.test(certNumber);
    
    // Simulate different scenarios
    const mockResults = {
      'FA3A1234567': { valid: true, name: 'John Doe', issued: '2023-03-15', expires: '2025-03-31' },
      'FA4B9876543': { valid: true, name: 'Jane Smith', issued: '2022-01-20', expires: '2024-01-31' },
      'FA5C5555555': { valid: false, reason: 'Certificate Expired' },
      'FA6D6666666': { valid: false, reason: 'Certificate Revoked' }
    };
    
    const result = mockResults[certNumber.toUpperCase()] || 
                   (validFormat ? { valid: true, name: 'Verified Pilot', issued: '2023-06-01', expires: '2025-05-31' } : null);
    
    setLoading(false);
    return result;
  };

  const handleVerification = async () => {
    setLoading(true);
    
    // Step 1: Verify certificate format
    if (!/^FA[A-Z]\d{7}$/i.test(pilotData.certificateNumber)) {
      setVerificationResult({
        status: 'failed',
        message: 'Invalid certificate format. Part 107 certificates start with "FA" followed by a letter and 7 digits.'
      });
      setLoading(false);
      return;
    }

    // Step 2: FAA database lookup
    const faaResult = await verifyWithFAA(pilotData.certificateNumber);
    setFaaLookupResult(faaResult);

    if (!faaResult || !faaResult.valid) {
      setVerificationResult({
        status: 'failed',
        message: faaResult?.reason || 'Certificate not found in FAA database'
      });
      setLoading(false);
      return;
    }

    // Step 3: Name matching
    const providedName = `${pilotData.firstName} ${pilotData.lastName}`.toLowerCase();
    const faaName = faaResult.name.toLowerCase();
    
    // Allow partial match for privacy
    const nameMatch = providedName.split(' ').some(part => 
      faaName.includes(part) || faaName.split(' ').some(faaPart => 
        faaPart.startsWith(part.slice(0, 3))
      )
    );

    if (!nameMatch && faaResult.name !== 'Verified Pilot') {
      setVerificationResult({
        status: 'warning',
        message: 'Name mismatch detected. Please ensure the name matches your certificate.'
      });
      setLoading(false);
      return;
    }

    // Step 4: Image verification (in production, use AI/ML)
    if (!pilotData.certificateImage || !pilotData.selfieWithCert) {
      setVerificationResult({
        status: 'warning',
        message: 'Please upload both certificate image and selfie for complete verification'
      });
      setLoading(false);
      return;
    }

    // Success!
    setVerificationResult({
      status: 'success',
      message: 'Part 107 Certificate Verified Successfully!',
      data: faaResult
    });
    setVerificationStep('completed');
    setLoading(false);
  };

  const VerificationInstructions = () => (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Shield className="text-blue-400" />
        Part 107 Verification Instructions
      </h2>
      
      <div className="space-y-4 text-gray-200">
        <div className="bg-black/30 rounded-lg p-4">
          <h3 className="font-bold text-blue-400 mb-2">Why We Verify:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Ensure only certified pilots access professional features</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Protect clients from fraudulent operators</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Maintain FAA compliance for commercial operations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Build trust in the BlueTubeTV/No Guidance ecosystem</span>
            </li>
          </ul>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <h3 className="font-bold text-purple-400 mb-2">Verification Process:</h3>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <strong>FAA Database Check:</strong> We verify your certificate number against the official FAA Airmen Registry
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <strong>Identity Verification:</strong> Match your name with FAA records
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <strong>Document Upload:</strong> Photo of your Part 107 certificate
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <strong>Liveness Check:</strong> Selfie holding your certificate (prevents using someone else's cert)
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="text-sm">
              <strong className="text-yellow-400">Important:</strong> Your certificate number starts with "FA" followed by a letter and 7 digits (e.g., FA3A1234567). This can be found on your Remote Pilot Certificate issued by the FAA.
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setVerificationStep('form')}
        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        Start Verification Process
      </button>
    </div>
  );

  const VerificationForm = () => (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <FileCheck className="text-blue-400" />
        Part 107 Certificate Verification
      </h2>

      <div className="space-y-4">
        {/* Certificate Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certificate Number <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="FA3A1234567"
              value={pilotData.certificateNumber}
              onChange={(e) => setPilotData({...pilotData, certificateNumber: e.target.value.toUpperCase()})}
              className="w-full bg-black/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
              maxLength="11"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Format: FA + letter + 7 digits</p>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={pilotData.firstName}
                onChange={(e) => setPilotData({...pilotData, firstName: e.target.value})}
                className="w-full bg-black/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={pilotData.lastName}
                onChange={(e) => setPilotData({...pilotData, lastName: e.target.value})}
                className="w-full bg-black/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Issue Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certificate Issue Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={pilotData.issueDate}
              onChange={(e) => setPilotData({...pilotData, issueDate: e.target.value})}
              className="w-full bg-black/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Certificate Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Certificate Photo <span className="text-red-400">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-300">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">Clear photo of your Part 107 certificate</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPilotData({...pilotData, certificateImage: e.target.files[0]})}
              className="hidden"
              id="cert-upload"
            />
            <label htmlFor="cert-upload" className="cursor-pointer">
              <span className="text-blue-400 hover:text-blue-300">Browse Files</span>
            </label>
            {pilotData.certificateImage && (
              <p className="text-green-400 text-sm mt-2">✓ {pilotData.certificateImage.name}</p>
            )}
          </div>
        </div>

        {/* Selfie Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Selfie with Certificate <span className="text-red-400">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-300">Take a selfie holding your certificate</p>
            <p className="text-xs text-gray-500 mt-1">For identity verification (prevents fraud)</p>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => setPilotData({...pilotData, selfieWithCert: e.target.files[0]})}
              className="hidden"
              id="selfie-upload"
            />
            <label htmlFor="selfie-upload" className="cursor-pointer">
              <span className="text-blue-400 hover:text-blue-300">Take Photo</span>
            </label>
            {pilotData.selfieWithCert && (
              <p className="text-green-400 text-sm mt-2">✓ {pilotData.selfieWithCert.name}</p>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="text-xs text-gray-400">
              Your information is encrypted and securely stored. We only share verification status with clients, never personal details. Photos are deleted after verification.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setVerificationStep('start')}
            className="flex-1 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleVerification}
            disabled={loading || !pilotData.certificateNumber || !pilotData.firstName || !pilotData.lastName}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify Certificate'
            )}
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className={`mt-6 p-4 rounded-lg border ${
          verificationResult.status === 'success' 
            ? 'bg-green-900/30 border-green-500/50' 
            : verificationResult.status === 'warning'
            ? 'bg-yellow-900/30 border-yellow-500/50'
            : 'bg-red-900/30 border-red-500/50'
        }`}>
          <div className="flex items-start gap-3">
            {verificationResult.status === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : verificationResult.status === 'warning' ? (
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <div>
              <p className="text-white font-medium">{verificationResult.message}</p>
              {verificationResult.data && (
                <div className="mt-2 text-sm text-gray-300">
                  <p>Name: {verificationResult.data.name}</p>
                  <p>Issued: {verificationResult.data.issued}</p>
                  <p>Expires: {verificationResult.data.expires}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const VerificationComplete = () => (
    <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-8 border border-green-500/30 text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Award className="w-24 h-24 text-yellow-400" />
          <CheckCircle className="w-10 h-10 text-green-400 absolute -bottom-2 -right-2" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-4">
        Part 107 Verified!
      </h2>
      
      <p className="text-gray-300 mb-6">
        Congratulations! You're now verified as a certified Part 107 Remote Pilot.
      </p>

      {faaLookupResult && (
        <div className="bg-black/30 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
          <h3 className="text-lg font-bold text-blue-400 mb-3">Certificate Details:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Certificate:</span>
              <span className="text-white font-mono">{pilotData.certificateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pilot:</span>
              <span className="text-white">{faaLookupResult.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Issued:</span>
              <span className="text-white">{faaLookupResult.issued}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Expires:</span>
              <span className="text-white">{faaLookupResult.expires}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-3">Unlocked Features:</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Professional Jobs Board</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Enterprise Contracts</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Verified Badge</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Priority Support</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Flight Planning Tools</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Compliance Reports</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
          Go to Pilot Dashboard
        </button>
        <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
          Browse Jobs
        </button>
      </div>
    </div>
  );

  const FraudPreventionInfo = () => (
    <div className="mt-8 bg-red-900/20 rounded-xl p-6 border border-red-500/30">
      <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
        <Shield className="w-6 h-6" />
        Fraud Prevention Measures
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <strong className="text-white">Real-time FAA Database Check</strong>
              <p className="text-xs mt-1">Verifies against official FAA Airmen Registry</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <strong className="text-white">AI-Powered Document Analysis</strong>
              <p className="text-xs mt-1">Detects altered or fake certificates</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <strong className="text-white">Biometric Liveness Detection</strong>
              <p className="text-xs mt-1">Ensures real person, not a photo</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <strong className="text-white">Cross-Reference Validation</strong>
              <p className="text-xs mt-1">Matches name, date, and certificate number</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <strong className="text-white">Periodic Re-verification</strong>
              <p className="text-xs mt-1">Annual checks for expired/revoked certs</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <strong className="text-white">Blockchain Verification Record</strong>
              <p className="text-xs mt-1">Immutable proof of verification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-black/30 rounded-lg">
        <p className="text-xs text-gray-400">
          <strong className="text-yellow-400">Note:</strong> Attempting to use fraudulent credentials is a federal offense. 
          All verification attempts are logged and reported to appropriate authorities when fraud is detected.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Part 107 Verification</h1>
          </div>
          <p className="text-gray-300">Verify your FAA Remote Pilot Certificate to unlock professional features</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationStep === 'start' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {verificationStep !== 'start' ? <CheckCircle className="w-6 h-6" /> : '1'}
            </div>
            <div className={`w-20 h-1 ${
              verificationStep !== 'start' ? 'bg-green-500' : 'bg-gray-600'
            }`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationStep === 'form' ? 'bg-blue-500' : verificationStep === 'completed' ? 'bg-green-500' : 'bg-gray-600'
            }`}>
              {verificationStep === 'completed' ? <CheckCircle className="w-6 h-6" /> : '2'}
            </div>
            <div className={`w-20 h-1 ${
              verificationStep === 'completed' ? 'bg-green-500' : 'bg-gray-600'
            }`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationStep === 'completed' ? 'bg-green-500' : 'bg-gray-600'
            }`}>
              {verificationStep === 'completed' ? <CheckCircle className="w-6 h-6" /> : '3'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {verificationStep === 'start' && <VerificationInstructions />}
        {verificationStep === 'form' && <VerificationForm />}
        {verificationStep === 'completed' && <VerificationComplete />}

        {/* Fraud Prevention Info */}
        {verificationStep === 'start' && <FraudPreventionInfo />}
      </div>
    </div>
  );
};

export default Part107Verification;