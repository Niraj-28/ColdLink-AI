# ColdLink AI - React Frontend

Modern React frontend for ColdLink AI vaccine cold chain monitoring system.

## Features

- **Dashboard**: Real-time overview with statistics, risk distribution charts, and trend analysis
- **Prediction**: Interactive form for risk assessment with SHAP explanations
- **Batch Analysis**: Comprehensive batch monitoring with filters and detailed views
- **Analytics**: Model performance metrics and feature importance visualization
- **Live Risk Monitor**: Real-time alerts with auto-refresh capabilities

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation
- Axios for API communication

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running on http://localhost:8000

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev

# Application will be available at http://localhost:3000
```

## Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── StatsCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Prediction.tsx
│   │   ├── BatchAnalysis.tsx
│   │   ├── Analytics.tsx
│   │   └── LiveRisk.tsx
│   ├── services/       # API services
│   │   └── api.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## API Integration

The frontend communicates with the FastAPI backend through the API service layer (`src/services/api.ts`). Ensure the backend is running before starting the frontend.

Backend must be available at: `http://localhost:8000`

## Environment Variables

Create a `.env` file if you need to customize the API URL:

```
VITE_API_URL=http://localhost:8000
```

## Features Overview

### Dashboard
- Key statistics cards
- Risk distribution pie chart
- Risk trend over time
- Risk by location analysis

### Prediction
- 12-field input form
- Real-time risk prediction
- SHAP feature importance
- Actionable recommendations

### Batch Analysis
- Searchable and filterable batch list
- Expandable batch details
- Risk level indicators
- Temperature and expiry monitoring

### Analytics
- Model performance metrics
- Model comparison charts
- Feature importance ranking
- Training information

### Live Risk Monitor
- Auto-refreshing dashboard
- Critical batch alerts
- Real-time status monitoring
- Batch status table

## License

MIT
