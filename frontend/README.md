# ColdLink AI - Frontend

React-based frontend application for the ColdLink AI cold chain prediction system.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── StatCard.jsx
│   │   ├── RiskBadge.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/          # Page components
│   │   ├── Overview.jsx
│   │   ├── LiveRisk.jsx
│   │   ├── BatchAnalysis.jsx
│   │   ├── Prediction.jsx
│   │   ├── Analytics.jsx
│   │   ├── ModelPerformance.jsx
│   │   ├── AIInsights.jsx
│   │   └── About.jsx
│   ├── utils/          # Utility functions
│   │   ├── api.js      # API client
│   │   └── helpers.js  # Helper functions
│   ├── styles/         # Global styles
│   │   └── index.css   # Tailwind imports
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:8000
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Pages

### Overview
- Dashboard with key statistics
- Risk distribution visualization
- System status
- Quick action links

### Live Risk
- Real-time batch monitoring
- Search and filter functionality
- Sortable table
- Pagination

### Batch Analysis
- Detailed batch information
- Temperature and humidity timelines
- Risk probability timeline
- SHAP explanations
- Recommendations

### Prediction
- Interactive form for new predictions
- Real-time risk assessment
- Risk factors display
- Actionable recommendations

### Analytics
- Risk trends over time
- Distribution by location and storage
- Comparative analysis

### Model Performance
- Model comparison metrics
- ROC and PR curves
- Confusion matrices

### AI Insights
- SHAP feature importance
- Global explanations
- Model interpretability

### About
- Project information
- Technical stack
- Mission statement

## API Integration

The frontend connects to the FastAPI backend through the API service (`src/utils/api.js`).

All API calls are proxied through Vite dev server to avoid CORS issues:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Proxy: `/api/*` → `http://localhost:8000/api/*`

## Design System

### Colors
- **Primary**: Blue (`primary-*`)
- **Accent**: Teal (`teal-*`)
- **Risk Levels**:
  - Critical: Red
  - High: Orange
  - Medium: Yellow
  - Low: Green

### Components
- Cards with shadow-md
- Responsive grid layouts
- Clean, minimal design
- Professional healthcare aesthetic

## Development

- Hot Module Replacement (HMR) enabled
- ESLint configuration for code quality
- PostCSS with Tailwind CSS processing
- Fast refresh for instant updates
