import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  PackageSearch, 
  BarChart3, 
  AlertTriangle,
  Thermometer,
  CircleDot,
  Award
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Prediction', path: '/prediction', icon: Activity },
    { name: 'Batch Analysis', path: '/batches', icon: PackageSearch },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Live Monitor', path: '/live-risk', icon: AlertTriangle },
    { name: 'Model Performance', path: '/model-performance', icon: Award },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2.5 rounded-lg shadow-sm">
                <Thermometer className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">ColdLink AI</h1>
                <p className="text-xs text-gray-500">Vaccine Cold Chain Monitoring System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <CircleDot className="h-3 w-3 text-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                    ${
                      active
                        ? 'border-primary-600 text-primary-600 bg-primary-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2026 ColdLink AI • Intelligent Cold Chain Monitoring System
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Powered by Machine Learning & SHAP Explainability
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
