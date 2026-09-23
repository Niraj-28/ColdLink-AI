import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import BatchAnalysis from './pages/BatchAnalysis';
import Analytics from './pages/Analytics';
import LiveRisk from './pages/LiveRisk';
import ModelPerformance from './pages/ModelPerformance';
import AIInsights from './pages/AIInsights';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="batches" element={<BatchAnalysis />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="live-risk" element={<LiveRisk />} />
          <Route path="model-performance" element={<ModelPerformance />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
