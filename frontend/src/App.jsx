import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import LiveRisk from './pages/LiveRisk';
import BatchAnalysis from './pages/BatchAnalysis';
import Prediction from './pages/Prediction';
import Analytics from './pages/Analytics';
import ModelPerformance from './pages/ModelPerformance';
import AIInsights from './pages/AIInsights';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/live-risk" element={<LiveRisk />} />
          <Route path="/batch/:batchId" element={<BatchAnalysis />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/model-performance" element={<ModelPerformance />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
