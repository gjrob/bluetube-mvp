import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Activity, Navigation, Battery } from 'lucide-react';
import FlightComplianceAIPanel from './FlightComplianceAI';

export default function FlightCompliance({ streamKey }) {
  const effectiveStreamKey = streamKey || 'demo-stream';
  console.log('FlightCompliance using streamKey:', effectiveStreamKey);
  const simulationInterval = useRef(null);

  const [droneStatus, setDroneStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [violations, setViolations] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Fetch drone status
  const fetchDroneStatus = async () => {
    try {
      const res = await fetch(`/api/drone/status?stream_key=${effectiveStreamKey}`);
      if (res.ok) {
        const data = await res.json();
        setDroneStatus(data);
        if (data.violations) setViolations(data.violations);
      }
    } catch (error) {
      console.error('Error fetching drone status:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/faa/analytics?stream_key=${effectiveStreamKey}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Connect/disconnect drone
  const toggleDroneConnection = async () => {
    console.log('Toggle connection clicked, current state:', isConnected);
    setIsLoading(true);
    try {
      const res = await fetch('/api/drone/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: isConnected ? 'disconnect' : 'connect', stream_key: effectiveStreamKey })
      });
      console.log('Sending to API:', { action: isConnected ? 'disconnect' : 'connect', stream_key: effectiveStreamKey });
      const payload = { action: isConnected ? 'disconnect' : 'connect', stream_key: effectiveStreamKey };
      console.log('Sending payload:', payload);

      if (res.ok) {
        fetchDroneStatus();
        console.log('Fetching drone status...');
        setIsConnected(!isConnected);
        console.log('Drone connection toggled:', !isConnected);
      }
    } catch (error) {
      console.error('Error toggling drone connection:', error);
    } finally {
      setIsLoading(false);
    }
  };
// Submit telemetry data
const submitTelemetry = async () => {
    if (!droneStatus?.telemetry) return;

    try {
      await fetch('/api/faa/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telemetry: droneStatus.telemetry, stream_key: effectiveStreamKey })
      });
    } catch (error) {
      console.error('Error submitting telemetry:', error);
    }
  };

// Simulate drone data (if needed)
const simulateDroneData = async () => {
  const newTelemetry = {
    connected: true,
    altitude: Math.random() * 450,  // Random altitude 0-450ft
    speed: Math.random() * 35,      // Random speed 0-35mph
    battery: 100 - (Math.random() * 20),  // Battery 80-100%
    signalStrength: 85 + (Math.random() * 15),  // Signal 85-100%
    flightTime: 0,
    heading: Math.random() * 360,
    location: { lat: 34.2257, lng: -77.9447 }
  };

  // Update the state with full drone data
  setDroneStatus({
    connected: true,
    telemetry: newTelemetry
  });

  // Submit to backend
  await submitTelemetry(newTelemetry);
};

  // Simulate telemetry updates
useEffect(() => {
  let interval;
  
  if (isConnected) {
    // Set initial telemetry data
    setDroneStatus({
      connected: true,
      telemetry: {
        connected: true,
        altitude: 285,
        speed: 15,
        battery: 100,
        signalStrength: 95,
        flightTime: 0,
        heading: 0,
        location: { lat: 34.2257, lng: -77.9447 }
      }
    });
    
    // Update every 2 seconds
    interval = setInterval(() => {
      setDroneStatus(prev => {
        if (!prev || !prev.telemetry) return prev;
        
        const newTelemetry = {
          ...prev.telemetry,
          altitude: prev.telemetry.altitude + (Math.random() - 0.5) * 20,
          speed: 15 + Math.random() * 10,
          battery: Math.max(20, prev.telemetry.battery - 0.1),
          flightTime: prev.telemetry.flightTime + 2
        };
        
        // Submit telemetry in background
        submitTelemetry(newTelemetry);
        
        return {
          ...prev,
          telemetry: newTelemetry
        };
      });
      const checkCompliance = async () => {
  try {
    const response = await fetch('/api/faa/train-model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flightData: {
          streamId: id,
          timestamp: new Date()
        },
        location: { lat: 34.0522, lng: -118.2437 }, // Get from browser
        altitude: 250, // Get from drone telemetry
        droneModel: 'DJI Mavic 3'
      })
    });
    
    const data = await response.json();
    setComplianceStatus(data.compliance);
  } catch (error) {
    console.error('Compliance check failed:', error);
  }
};
      // Refresh analytics
      fetchAnalytics();
    }, 2000);
  } else {
    // Reset when disconnected
    setDroneStatus(null);
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [isConnected]); // Only depend on isConnected

  // Initial load
  useEffect(() => {
    fetchDroneStatus();
    fetchAnalytics();
  }, []);
  useEffect(() => {
  if (isConnected && droneStatus) {
    const interval = setInterval(() => {
      simulateDroneData();
    }, 2000);
    
    return () => clearInterval(interval);
  }
  }, [isConnected, droneStatus]);
  return (
    <div className="bg-zinc-900 rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Flight Compliance Monitor
        </h2>
        <button
          onClick={toggleDroneConnection}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            isConnected 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isConnected ? 'Disconnect Drone' : 'Connect Drone'}
        </button>
      </div>

      {/* Telemetry Display */}
      {droneStatus?.telemetry && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Navigation className="w-4 h-4" />
              <span className="text-sm">Altitude</span>
            </div>
            <div className={`text-2xl font-bold ${
              droneStatus.telemetry.altitude > 400 ? 'text-red-500' : 'text-white'
            }`}>
              {droneStatus.telemetry.altitude.toFixed(0)}ft
            </div>
            {droneStatus.telemetry.altitude > 400 && (
              <div className="text-xs text-red-400 mt-1">⚠️ FAA Limit: 400ft</div>
            )}
            {isConnected && droneStatus?.telemetry && (
            <FlightComplianceAIPanel 
             streamKey={effectiveStreamKey}
             currentTelemetry={droneStatus.telemetry}
             />
      )}
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Speed</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {droneStatus.telemetry.speed.toFixed(1)}mph
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Battery className="w-4 h-4" />
              <span className="text-sm">Battery</span>
            </div>
            <div className={`text-2xl font-bold ${
              droneStatus.telemetry.battery < 20 ? 'text-orange-500' : 'text-white'
            }`}>
              {droneStatus.telemetry.battery.toFixed(0)}%
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Compliance</span>
            </div>
            <div className={`text-2xl font-bold ${
              analytics?.complianceRate >= 95 ? 'text-green-500' : 'text-orange-500'
            }`}>
              {analytics?.complianceRate.toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {/* Recent Violations */}
      {violations.length > 0 && (
        <div className="bg-zinc-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            Recent Violations
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {violations.map((violation, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">{violation.message}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(violation.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}