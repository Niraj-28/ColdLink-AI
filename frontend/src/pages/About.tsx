import { Package, Users, Target, Award, Github, Mail, ExternalLink, Heart, Code, Database, Brain, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="card bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 border-primary-200">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500 mb-4">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ColdLink AI</h1>
          <p className="text-xl text-primary-700 font-medium mb-4">
            Intelligent Cold Chain Monitoring & Risk Prediction
          </p>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Protecting vaccine integrity through AI-powered predictive analytics, 
            ensuring every dose reaches its destination safely.
          </p>
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card border-red-200 bg-gradient-to-br from-white to-red-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-red-600" />
            The Problem
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong>Vaccine Wastage:</strong> Millions of doses lost annually due to cold chain failures</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong>Reactive Monitoring:</strong> Traditional systems detect failures after they occur</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong>Complex Logistics:</strong> Multiple handoffs and temperature-sensitive storage requirements</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong>Limited Visibility:</strong> Lack of real-time insights into batch risk status</span>
            </li>
          </ul>
        </div>

        <div className="card border-green-200 bg-gradient-to-br from-white to-green-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-green-600" />
            Our Solution
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Predictive AI:</strong> Forecast cold chain failures before they happen</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Real-time Monitoring:</strong> Continuous tracking of all critical parameters</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Explainable AI:</strong> SHAP-based explanations for every prediction</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Actionable Insights:</strong> Clear recommendations for risk mitigation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Code className="h-5 w-5 mr-2 text-primary-600" />
          Technology Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Brain className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Machine Learning</h4>
            <p className="text-xs text-gray-600">Random Forest, XGBoost, SHAP</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <Zap className="h-8 w-8 text-green-600 mb-2" />
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Backend</h4>
            <p className="text-xs text-gray-600">Python, FastAPI, Pandas</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Code className="h-8 w-8 text-purple-600 mb-2" />
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Frontend</h4>
            <p className="text-xs text-gray-600">React, TypeScript, Tailwind CSS</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <Database className="h-8 w-8 text-yellow-600 mb-2" />
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Data</h4>
            <p className="text-xs text-gray-600">26,674 observations, 30 batches</p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Features & Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">🎯 Risk Prediction</h4>
              <p className="text-sm text-gray-600">
                AI-powered predictions with 90%+ accuracy using ensemble models (Random Forest, XGBoost)
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">📊 Real-time Dashboard</h4>
              <p className="text-sm text-gray-600">
                Live monitoring of all batches with automatic risk assessment and alerts
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">🔍 Batch Analysis</h4>
              <p className="text-sm text-gray-600">
                Detailed historical analysis with temperature/humidity trends and risk evolution
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">💡 Explainable AI</h4>
              <p className="text-sm text-gray-600">
                SHAP-based explanations showing exactly why a batch is at risk
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">⚡ Performance Optimized</h4>
              <p className="text-sm text-gray-600">
                Sub-second response times with intelligent caching and pre-computation
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">🎨 Modern UI/UX</h4>
              <p className="text-sm text-gray-600">
                Clean, responsive interface built with React and Tailwind CSS
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">📈 Model Comparison</h4>
              <p className="text-sm text-gray-600">
                Comprehensive evaluation of multiple ML models with detailed metrics
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">🔒 Input Validation</h4>
              <p className="text-sm text-gray-600">
                Robust error handling and validation for all user inputs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">89%+</div>
            <div className="text-xs text-gray-600 mt-1">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">87%+</div>
            <div className="text-xs text-gray-600 mt-1">Precision</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">85%+</div>
            <div className="text-xs text-gray-600 mt-1">Recall</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">86%+</div>
            <div className="text-xs text-gray-600 mt-1">F1-Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">92%+</div>
            <div className="text-xs text-gray-600 mt-1">ROC-AUC</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4 text-center italic">
          Best Model: Random Forest | Trained on 26,674 observations | 100+ engineered features
        </p>
      </div>

      {/* Team & Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            About the Project
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>ColdLink AI</strong> is an academic project demonstrating end-to-end machine learning 
              system development, from data preprocessing to production deployment.
            </p>
            <p>
              The project showcases:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Advanced ML techniques (ensemble models, SHAP)</li>
              <li>Full-stack development (FastAPI + React)</li>
              <li>Production-ready code with optimizations</li>
              <li>Comprehensive documentation and testing</li>
            </ul>
          </div>
        </div>

        <div className="card border-purple-200 bg-gradient-to-br from-white to-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-purple-600" />
            Contact & Links
          </h3>
          <div className="space-y-3">
            <a 
              href="https://github.com/Niraj-28/ColdLink-AI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Github className="h-5 w-5 text-gray-700 mr-3" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">GitHub Repository</div>
                <div className="text-xs text-gray-600">View source code and documentation</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>

            <a 
              href="https://github.com/Niraj-28" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Users className="h-5 w-5 text-gray-700 mr-3" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">Author: Niraj</div>
                <div className="text-xs text-gray-600">@Niraj-28 on GitHub</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card bg-gradient-to-r from-primary-500 to-indigo-600 text-white">
        <div className="text-center py-6">
          <Heart className="h-6 w-6 mx-auto mb-3 animate-pulse" />
          <p className="text-sm font-medium">
            Built with React, TypeScript, FastAPI, and Machine Learning
          </p>
          <p className="text-xs mt-2 opacity-90">
            ColdLink AI - Protecting vaccine integrity through intelligent monitoring
          </p>
          <p className="text-xs mt-4 opacity-75">
            © 2026 ColdLink AI | Academic Project | MIT License
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
