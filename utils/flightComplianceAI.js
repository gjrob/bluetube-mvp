import * as tf from '@tensorflow/tfjs';

export class FlightComplianceAI {
  constructor() {
    this.model = null;
    this.isTraining = false;
  }

  // Create the neural network model
  createModel() {
    const model = tf.sequential({
      layers: [
        // Input layer - 7 features: altitude, speed, battery, signal, heading, lat, lng
        tf.layers.dense({ inputShape: [7], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        
        // Hidden layers
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        
        // Output layer - 4 predictions:
        // [altitudeViolationRisk, batteryWarning, signalLoss, overallSafety]
        tf.layers.dense({ units: 4, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.model = model;
    return model;
  }

  // Prepare training data from telemetry
  prepareTrainingData(telemetryData) {
    const features = [];
    const labels = [];

    telemetryData.forEach(entry => {
      // Input features
      features.push([
        entry.altitude / 500,  // Normalize altitude (0-500ft)
        entry.speed / 50,      // Normalize speed (0-50mph)
        entry.battery / 100,   // Normalize battery (0-100%)
        entry.signal_strength / 100,
        entry.heading / 360,   // Normalize heading (0-360°)
        (entry.location.lat - 34) / 10,  // Normalize latitude
        (entry.location.lng + 78) / 10   // Normalize longitude
      ]);

      // Labels (what we want to predict)
      labels.push([
        entry.altitude > 380 ? 1 : 0,  // Altitude violation risk
        entry.battery < 25 ? 1 : 0,     // Battery warning
        entry.signal_strength < 60 ? 1 : 0,  // Signal loss risk
        entry.altitude <= 400 && entry.battery > 20 ? 1 : 0  // Overall safety
      ]);
    });

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels)
    };
  }

  // Train the model
  async train(telemetryData, epochs = 50) {
    if (!this.model) {
      this.createModel();
    }

    this.isTraining = true;
    const { features, labels } = this.prepareTrainingData(telemetryData);

    const history = await this.model.fit(features, labels, {
      epochs,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
        }
      }
    });

    // Clean up tensors
    features.dispose();
    labels.dispose();
    
    this.isTraining = false;
    return history;
  }

  // Make predictions
  async predict(telemetry) {
    if (!this.model) {
      throw new Error('Model not trained yet');
    }

    const input = tf.tensor2d([[
      telemetry.altitude / 500,
      telemetry.speed / 50,
      telemetry.battery / 100,
      telemetry.signalStrength / 100,
      telemetry.heading / 360,
      (telemetry.location.lat - 34) / 10,
      (telemetry.location.lng + 78) / 10
    ]]);

    const prediction = await this.model.predict(input);
    const results = await prediction.data();
    
    input.dispose();
    prediction.dispose();

    return {
      altitudeViolationRisk: results[0],
      batteryWarning: results[1],
      signalLossRisk: results[2],
      overallSafety: results[3],
      recommendations: this.generateRecommendations(results, telemetry)
    };
  }

  // Generate smart recommendations
  generateRecommendations(predictions, telemetry) {
    const recommendations = [];

    if (predictions[0] > 0.7) {
      recommendations.push({
        type: 'ALTITUDE_WARNING',
        severity: 'HIGH',
        message: `Altitude violation predicted! Current: ${telemetry.altitude}ft. Descend to stay below 400ft.`,
        action: 'DESCEND'
      });
    }

    if (predictions[1] > 0.6) {
      recommendations.push({
        type: 'BATTERY_WARNING',
        severity: 'MEDIUM',
        message: `Low battery predicted. Current: ${telemetry.battery}%. Plan landing soon.`,
        action: 'LAND_SOON'
      });
    }

    if (predictions[2] > 0.5) {
      recommendations.push({
        type: 'SIGNAL_WARNING',
        severity: 'MEDIUM',
        message: 'Signal loss risk detected. Move closer to maintain connection.',
        action: 'REDUCE_DISTANCE'
      });
    }

    return recommendations;
  }

  // Save model to localStorage
  async saveModel() {
    if (this.model) {
      await this.model.save('localstorage://flight-compliance-model');
    }
  }

  // Load model from localStorage
  async loadModel() {
    try {
      this.model = await tf.loadLayersModel('localstorage://flight-compliance-model');
      return true;
    } catch (error) {
      console.log('No saved model found');
      return false;
    }
  }
}
