export interface Statistics {
  total_observations: number;
  total_batches: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  avg_temperature: number;
  avg_humidity: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface Batch {
  batch_id: string;
  timestamp: string;
  location: string;
  current_hop: string;
  external_storage: string;
  temperature: number;
  humidity: number;
  external_temperature: number;
  hours_in_transit: number;
  expiry_hours: number;
  oob_hours: number;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  is_expired: boolean;
  is_discarded: boolean;
  vaccine_type: string;
  quantity: number;
  transport_mode: string;
}

export interface BatchDetails {
  batch_id: string;
  summary: {
    current_location: string;
    current_hop: string;
    storage_type: string;
    current_temperature: number;
    current_humidity: number;
    expiry_hours: number;
    risk_probability: number;
    risk_level: string;
  };
  timeline: Array<{
    timestamp: string;
    temperature: number;
    humidity: number;
    risk_probability: number;
    location: string;
    hop: string;
  }>;
  shap_explanation: {
    top_factors: Array<{
      feature: string;
      value: number;
      contribution: number;
      abs_contribution: number;
    }>;
    base_value: number;
  };
  recommendation: string;
}

export interface PredictionRequest {
  thermal_shipper_temp_reading: number;
  room_temp_reading: number;
  room_humidity_reading: number;
  item_expiry_hours: number;
  ultra_low_temperature_freezer_hours: number;
  out_of_bound_temperature_hours: number;
  refrigeration_temperature_hours: number;
  location: string;
  current_hop: string;
  external_storage: string;
  hour?: number;
  day_of_week?: number;
}

export interface PredictionResponse {
  risk_probability: number;
  risk_level: string;
  risk_category: string;
  confidence: number;
  top_risk_factors: Array<{
    feature: string;
    value: number;
    contribution: number;
    abs_contribution: number;
  }>;
  recommendation: string;
}

export interface ModelMetrics {
  best_model: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
  };
  all_models: Record<string, any>;
  training_info: {
    training_date: string;
    train_size: number;
    val_size: number;
    test_size: number;
    num_features: number;
  };
}

export interface FeatureImportance {
  features: Array<{
    feature: string;
    importance: number;
  }>;
}

export interface RiskSummary {
  risk_distribution: Record<string, number>;
  risk_by_location: Record<string, { mean: number; count: number }>;
  risk_by_storage: Record<string, { mean: number; count: number }>;
  average_risk: number;
  high_risk_percentage: number;
}

export interface RiskTrend {
  trend: Array<{
    date: string;
    avg_risk: number;
    max_risk: number;
    num_observations: number;
  }>;
}
