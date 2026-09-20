import React from 'react';
import { Activity, Brain, Shield, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">About ColdLink AI</h2>
        <p className="mt-1 text-sm text-gray-600">
          Predicting cold chain failure - protecting every vaccine dose
        </p>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h3>
        <p className="text-gray-700 leading-relaxed">
          ColdLink AI is an advanced machine learning system designed to predict cold chain failures
          in vaccine shipments. By analyzing temperature, humidity, storage conditions, and temporal
          patterns, our AI models can identify at-risk batches before critical failures occur,
          ensuring vaccine integrity and patient safety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="mt-4 font-semibold text-gray-900">Real-time Monitoring</h4>
          <p className="mt-2 text-sm text-gray-600">
            Continuous tracking of temperature and environmental conditions
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mx-auto">
            <Brain className="w-6 h-6 text-teal-600" />
          </div>
          <h4 className="mt-4 font-semibold text-gray-900">AI-Powered Predictions</h4>
          <p className="mt-2 text-sm text-gray-600">
            Advanced ML models with 90%+ accuracy using XGBoost and SHAP explainability
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="mt-4 font-semibold text-gray-900">Proactive Alerts</h4>
          <p className="mt-2 text-sm text-gray-600">
            Early warning system with actionable recommendations
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <h4 className="mt-4 font-semibold text-gray-900">Trend Analysis</h4>
          <p className="mt-2 text-sm text-gray-600">
            Historical patterns and predictive insights for optimization
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Machine Learning</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• XGBoost, Random Forest</li>
              <li>• SHAP Explainability</li>
              <li>• Temporal Feature Engineering</li>
              <li>• Scikit-learn Pipeline</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• FastAPI (Python)</li>
              <li>• RESTful API Design</li>
              <li>• Real-time Predictions</li>
              <li>• Async Processing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• React + Vite</li>
              <li>• Tailwind CSS</li>
              <li>• Recharts Visualization</li>
              <li>• Responsive Design</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Model Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">4</p>
            <p className="text-sm text-gray-600 mt-1">ML Models</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-600">90%+</p>
            <p className="text-sm text-gray-600 mt-1">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">100+</p>
            <p className="text-sm text-gray-600 mt-1">Features</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">26K+</p>
            <p className="text-sm text-gray-600 mt-1">Data Points</p>
          </div>
        </div>
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Mission Statement</h3>
        <p className="text-blue-800">
          Our mission is to ensure vaccine integrity throughout the cold chain by leveraging 
          artificial intelligence to predict and prevent temperature excursions, ultimately 
          protecting public health and reducing vaccine waste.
        </p>
      </div>
    </div>
  );
};

export default About;
