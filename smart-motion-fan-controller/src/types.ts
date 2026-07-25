export interface SimulationConfig {
  pirPin: number;
  relayPin: number;
  offDelaySeconds: number; // in seconds for UI slider
  relayActiveMode: 'LOW' | 'HIGH'; // LOW = Active LOW (default for most relay modules)
  fanWattage: number; // Watts
  electricityRate: number; // $/kWh or ₹/kWh
  currencySymbol: string;
  enableTempSensor: boolean; // Optional feature
  tempThreshold: number; // °C
  enableBuzzer: boolean;
  buzzerPin: number;
}

export interface SerialLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'motion' | 'off' | 'system' | 'custom';
}

export type TabType = 'simulator' | 'code' | 'wiring' | 'analytics' | 'guide';

export interface ComponentPin {
  name: string;
  pin: string;
  wireColor: string;
}
