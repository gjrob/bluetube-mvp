import { useState, useEffect } from 'react';
import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import { FlightComplianceAI } from '../utils/flightComplianceAI';

export default function FlightComplianceAIPanel({ streamKey, currentTelemetry }) {
  const [ai] = useState(() => new FlightComplianceAI());
  const [predictions, setPredictions] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [accuracy, setAccuracy] = useState(null);

  // Load saved model on mount
  useEffect(() => {
    const loadSavedModel = async () => {
      const loaded = await ai.loadModel();
      setModelReady(loaded);
    };
    loadSavedModel();
  }, []);

  // Train the model
  const trainModel = async () => {
    setIsTraining(true);
    try {
      // Fetch training data
      const res = await fetch(`/api/faa/train-model?stream_key=${streamKey}`);
      const { trainingData } = await res.json();

      if (trainingData.length < 100) {
        alert('Need at least 100 flight records to train. Keep flying!');
        return;
      }

      // Train the model
      const history = await ai.train(trainingData);
      const finalAccuracy = history.history.acc[history.history.acc.length - 1];
      setAccuracy(finalAccuracy);

      // Save the model
      await ai.saveModel();
      setModelReady(true);
      
      alert(`Training complete! Accuracy: ${(finalAccuracy * 100).toFixed(1)}%`);
    } catch (error) {
      console.error('Training error:', error);
      alert('Training failed. Check console for details.');
    } finally {
      setIsTraining(false);
    }
  };

  // Make predictions when telemetry updates
  useEffect(() => {
    const makePrediction = async () => {
      if (!modelReady || !currentTelemetry) return;

      try {
        const prediction = await ai.predict(currentTelemetry);
        setPredictions(prediction);
      } catch (error) {
        console.error('Prediction error:', error);
      }
    };

    makePrediction();
  }, [currentTelemetry, modelReady]);

  return (
    <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6" />
          AI Flight Assistant
        </h2>
        <button
          onClick={trainModel}
          disabled={isTraining}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            isTraining 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {isTraining ? 'Training...' : 'Train AI Model'}
        </button>
      </div>

      {/* Model Status */}
      <div className="bg-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Model Status</span>
          <span className={`font-semibold ${modelReady ? 'text-green-500' : 'text-yellow-500'}`}>
            {modelReady ? '✅ Ready' : '⚠️ Not Trained'}
          </span>
        </div>
        {accuracy && (
          <div className="mt-2 text-sm text-gray-400">
            Accuracy: {(accuracy * 100).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Predictions */}
      {predictions && modelReady && (
        <>
          {/* Risk Levels */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Altitude Risk</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      predictions.altitudeViolationRisk > 0.7 ? 'bg-red-500' : 
                      predictions.altitudeViolationRisk > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${predictions.altitudeViolationRisk * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">
                  {(predictions.altitudeViolationRisk * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Overall Safety</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      predictions.overallSafety > 0.7 ? 'bg-green-500' : 
                      predictions.overallSafety > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${predictions.overallSafety * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">
                  {(predictions.overallSafety * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          {predictions.recommendations.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                AI Recommendations
              </h3>
              <div className="space-y-2">
                {predictions.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <TrendingUp className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      rec.severity === 'HIGH' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <div>
                      <p className="text-gray-300">{rec.message}</p>
                      <p className="text-gray-500 text-xs mt-1">Action: {rec.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}