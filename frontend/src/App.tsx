import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import BatchAnalysis from './pages/BatchAnalysis';
import Analytics from './pages/Analytics';
import LiveRisk from './pages/LiveRisk';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
