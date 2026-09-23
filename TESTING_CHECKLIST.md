# ColdLink AI - Complete Testing Checklist

## Pre-Testing Setup

### 1. Start Backend (Demo Mode)
```bash
cd backend
python main_demo.py
```

**Expected Output:**
```
✓ Dataset loaded: (26674, 13)
✓ Running in DEMO MODE (no ML models)
✓ Server ready (Demo Mode - Using Mock Predictions)
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in XXX ms
➜  Local:   http://localhost:3000/
➜  press h to show help
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

---

## UI/UX Testing Checklist

### Dashboard Page Testing

#### Layout & Formatting
- [ ] Header displays "Dashboard Overview" with proper font size
- [ ] Subtitle shows correctly under header
- [ ] Refresh button is properly aligned to the right
- [ ] Stats cards are in a 4-column grid on desktop
- [ ] Stats cards stack properly on mobile

#### Stats Cards
- [ ] **Total Batches** - Shows correct number with proper formatting
- [ ] **High Risk** - Displays in red color scheme
- [ ] **Low Risk** - Displays in green color scheme
- [ ] **Avg Temp** - Shows temperature with °C symbol

#### Risk Distribution Chart
- [ ] Pie chart renders correctly
- [ ] Chart shows three segments (Low, Medium, High)
- [ ] Percentages are displayed on chart
- [ ] Legend shows below chart with colored indicators
- [ ] Numbers match between chart and legend

#### System Metrics Card
- [ ] Average Risk Score bar displays correctly
- [ ] High Risk Percentage bar displays correctly
- [ ] Temperature and Humidity cards show proper formatting
- [ ] Status indicators (Within Range/Normal) display
- [ ] Monitoring period dates are formatted correctly

#### Risk Trend Chart
- [ ] Line chart renders with proper dimensions
- [ ] Two lines visible (Average Risk and Max Risk)
- [ ] X-axis shows dates clearly
- [ ] Y-axis shows percentages
- [ ] Tooltip appears on hover
- [ ] Legend is visible

#### Risk by Location Chart
- [ ] Bar chart renders correctly
- [ ] Location names are readable (angled text)
- [ ] Bars show different heights based on data
- [ ] Tooltip shows on hover
- [ ] Colors are consistent

#### Data Verification
- [ ] All numbers are dynamic (from API)
- [ ] No hardcoded values visible
- [ ] Refresh button updates all data
- [ ] Loading spinner appears during data fetch

---

### Prediction Page Testing

#### Layout & Formatting
- [ ] Page uses 3:2 grid layout (form:results)
- [ ] Form occupies left 60% on desktop
- [ ] Results occupy right 40% on desktop
- [ ] Sections have proper spacing
- [ ] Headers have border bottom for separation

#### Form Sections
- [ ] **Temperature Readings** - 2 fields side by side
- [ ] **Environmental Conditions** - Humidity field
- [ ] **Expiry Information** - Expiry hours field
- [ ] **Storage Duration** - 3 fields in grid
- [ ] **Location & Supply Chain** - 3 dropdown fields
- [ ] **Time Information** - 2 fields side by side

#### Form Fields
- [ ] All labels are properly aligned
- [ ] Input fields have consistent height
- [ ] Placeholder text is visible
- [ ] Required fields are marked with *
- [ ] Helper text shows below fields
- [ ] Dropdown arrows are visible
- [ ] Number inputs allow decimals

#### Form Validation
- [ ] Required fields show validation
- [ ] Number fields only accept numbers
- [ ] Hour field accepts 0-23
- [ ] Day of week accepts 0-6
- [ ] Submit button disabled during loading
- [ ] Reset button clears all fields

#### Prediction Results
- [ ] Risk level badge displays prominently
- [ ] Risk percentage shows large and bold
- [ ] Confidence score displays clearly
- [ ] Recommendation box has blue background
- [ ] Recommendation text is readable

#### SHAP Factors
- [ ] Top 8 factors display
- [ ] Factor names are formatted (spaces instead of underscores)
- [ ] Values show with 2 decimals
- [ ] Contribution shows positive/negative
- [ ] Progress bars show correctly
- [ ] Red for positive, green for negative
- [ ] Factors are numbered 1-8

#### Empty State
- [ ] Large icon displays when no prediction
- [ ] "Ready to Predict" message shows
- [ ] Helper text displays

---

### Batch Analysis Page Testing

#### Layout & Formatting
- [ ] Header with title and description
- [ ] Filter section in card layout
- [ ] Search box spans 2 columns
- [ ] Risk and location filters in separate columns
- [ ] Results summary displays

#### Search & Filters
- [ ] Search box has magnifying glass icon
- [ ] Placeholder text is visible
- [ ] Risk level dropdown has all options
- [ ] Location dropdown populated from data
- [ ] Results count updates on filter change

#### Batch List
- [ ] Batch cards display in stacked layout
- [ ] Each card has batch ID as header
- [ ] Risk level badge shows on right
- [ ] Risk percentage displays prominently
- [ ] Timestamp shows formatted date
- [ ] Expand icon (chevron) visible

#### Batch Card (Collapsed)
- [ ] Batch ID in bold
- [ ] Timestamp below ID
- [ ] Risk badge with proper color
- [ ] Risk percentage large and bold
- [ ] Chevron down icon

#### Batch Card (Expanded)
- [ ] 4-column grid on desktop
- [ ] Location information section
- [ ] Temperature information section
- [ ] Environment section
- [ ] Status section
- [ ] All values display correctly
- [ ] Temperature status colored (red/green)
- [ ] Expiry hours colored (red/orange/green)
- [ ] Additional info row at bottom
- [ ] Chevron up icon when expanded

#### Empty State
- [ ] Package icon displays
- [ ] "No Batches Found" message
- [ ] Helper text to adjust filters

---

### Analytics Page Testing

#### Layout & Formatting
- [ ] Header with title and description
- [ ] Best Model Performance card at top
- [ ] 5 metric boxes in grid
- [ ] Training information section
- [ ] Model comparison chart
- [ ] Feature importance list

#### Best Model Performance
- [ ] Model name displays (with award icon)
- [ ] 5 metric boxes:
  - [ ] Accuracy (blue background)
  - [ ] Precision (green background)
  - [ ] Recall (purple background)
  - [ ] F1-Score (orange background)
  - [ ] ROC-AUC (indigo background)
- [ ] Percentages show with 1 decimal
- [ ] Values are large and bold

#### Training Information
- [ ] Training date formatted
- [ ] Dataset sizes show with commas
- [ ] 4-column grid layout
- [ ] All numbers display correctly

#### Model Comparison Chart
- [ ] Bar chart renders correctly
- [ ] 4 models displayed
- [ ] 4 bars per model (different colors)
- [ ] Legend shows at bottom
- [ ] Model names are readable
- [ ] Tooltip shows on hover

#### Feature Importance
- [ ] Top 15 features listed
- [ ] Features numbered 1-15
- [ ] Feature names formatted (spaces)
- [ ] Importance values show 4 decimals
- [ ] Progress bars display
- [ ] Bars scaled relative to #1 feature

#### Key Insights
- [ ] Gradient background (primary-50 to blue-50)
- [ ] 4 bullet points
- [ ] Bullet points use primary color
- [ ] Text is readable
- [ ] Numbers interpolated from data

---

### Live Risk Monitor Page Testing

#### Layout & Formatting
- [ ] Header with title and refresh button
- [ ] Status bar with 4 metrics
- [ ] 3 summary cards
- [ ] Critical alerts section (if applicable)
- [ ] Batch table

#### Header
- [ ] Title displays correctly
- [ ] Refresh button on right
- [ ] Refresh icon animates on click
- [ ] Button disabled during refresh

#### Status Bar
- [ ] Gradient background (blue-50 to indigo-50)
- [ ] 4 sections in grid:
  - [ ] Status indicator (green dot)
  - [ ] Last update time
  - [ ] Critical alerts count
  - [ ] Auto-refresh toggle
- [ ] Toggle switch works
- [ ] Status dot pulses

#### Summary Cards
- [ ] **Critical Batches** - Red border and icon
- [ ] **Active Batches** - Green border and icon
- [ ] **Expired/Discarded** - Gray border and icon
- [ ] Numbers display large and bold
- [ ] Icons properly colored

#### Critical Alerts Section
- [ ] Only shows if critical batches exist
- [ ] Red background alert boxes
- [ ] Batch ID prominent
- [ ] Risk badge displays
- [ ] 4-column info grid
- [ ] All values colored appropriately

#### Batch Table
- [ ] Table has proper headers
- [ ] 7 columns display
- [ ] Rows alternate colors on hover
- [ ] Risk badges in cells
- [ ] Temperature colored (red/green)
- [ ] Expiry colored (red/orange/green)
- [ ] Status badges display
- [ ] Timestamp formatted

#### Auto-Refresh
- [ ] Toggle switch updates state
- [ ] Auto-refresh works (30 seconds)
- [ ] Last update timestamp changes
- [ ] Manual refresh button works

---

## Functional Testing

### Test Case 1: Low Risk Prediction

**Input Data:**
```
Shipper Temperature: 5.0
Room Temperature: 22.0
Room Humidity: 55.0
Hours Until Expiry: 120.0
Ultra-Low Hours: 0.0
OOB Hours: 0.0
Refrigeration Hours: 24.0
Location: Mumbai
Current Hop: dest_vaccine_storage_unit
Storage Type: vaccine_storage_unit
Hour: 14
Day of Week: 2
```

**Expected Results:**
- [ ] Risk Level: LOW or MEDIUM
- [ ] Risk Probability: 10-35%
- [ ] Confidence: >60%
- [ ] Top factors include temperature and expiry
- [ ] Recommendation mentions normal conditions

---

### Test Case 2: High Risk Prediction

**Input Data:**
```
Shipper Temperature: 10.0  (too high!)
Room Temperature: 28.0
Room Humidity: 65.0
Hours Until Expiry: 15.0  (expiring soon!)
Ultra-Low Hours: 0.0
OOB Hours: 12.0  (out of bounds!)
Refrigeration Hours: 72.0
Location: Chennai
Current Hop: in_transit
Storage Type: thermal_shipper
Hour: 22
Day of Week: 5
```

**Expected Results:**
- [ ] Risk Level: HIGH or CRITICAL
- [ ] Risk Probability: 70-95%
- [ ] Confidence: >60%
- [ ] Top factors show temperature, expiry, OOB hours
- [ ] Recommendation shows urgent warnings

---

### Test Case 3: Critical Risk (Expired)

**Input Data:**
```
Shipper Temperature: 12.0  (way too high!)
Room Temperature: 30.0
Room Humidity: 70.0
Hours Until Expiry: -10.0  (EXPIRED!)
Ultra-Low Hours: 0.0
OOB Hours: 25.0  (long exposure!)
Refrigeration Hours: 96.0
Location: Ahmedabad
Current Hop: origin_cold_storage
Storage Type: ambient
Hour: 2
Day of Week: 6
```

**Expected Results:**
- [ ] Risk Level: CRITICAL
- [ ] Risk Probability: >85%
- [ ] Confidence: >80%
- [ ] Recommendation mentions EXPIRED and discard
- [ ] Multiple warning emojis in recommendation

---

## API Integration Testing

### Health Check
```bash
curl http://localhost:8000/api/health
```

**Expected Response:**
- [ ] status: "healthy"
- [ ] mode: "demo"
- [ ] models_loaded: 0
- [ ] data_loaded: true

### Statistics
```bash
curl http://localhost:8000/api/statistics
```

**Expected Response:**
- [ ] total_observations: number
- [ ] total_batches: number
- [ ] risk counts (high/medium/low)
- [ ] avg_temperature: decimal
- [ ] avg_humidity: decimal
- [ ] date_range: object with start/end

### Batches List
```bash
curl http://localhost:8000/api/batches?limit=5
```

**Expected Response:**
- [ ] total: number
- [ ] batches: array of 5 objects
- [ ] Each batch has all required fields
- [ ] risk_level is string
- [ ] risk_score is decimal

### Prediction
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"thermal_shipper_temp_reading":5.0,"room_temp_reading":22.0,"room_humidity_reading":55.0,"item_expiry_hours":48.0,"ultra_low_temperature_freezer_hours":0.0,"out_of_bound_temperature_hours":0.0,"refrigeration_temperature_hours":24.0,"location":"Mumbai","current_hop":"dest_vaccine_storage_unit","external_storage":"vaccine_storage_unit","hour":12,"day_of_week":2}'
```

**Expected Response:**
- [ ] risk_probability: decimal (0-1)
- [ ] risk_level: string
- [ ] confidence: decimal
- [ ] top_risk_factors: array
- [ ] recommendation: string

---

## Browser Compatibility Testing

### Chrome
- [ ] All pages load correctly
- [ ] Charts render properly
- [ ] Forms work correctly
- [ ] Navigation functions
- [ ] No console errors

### Firefox
- [ ] All pages load correctly
- [ ] Charts render properly
- [ ] Forms work correctly
- [ ] Navigation functions
- [ ] No console errors

### Edge
- [ ] All pages load correctly
- [ ] Charts render properly
- [ ] Forms work correctly
- [ ] Navigation functions
- [ ] No console errors

---

## Responsive Design Testing

### Desktop (1920x1080)
- [ ] All layouts display correctly
- [ ] Multi-column grids work
- [ ] Charts are appropriately sized
- [ ] No horizontal scrolling

### Laptop (1366x768)
- [ ] All content visible
- [ ] No layout breaking
- [ ] Charts resize appropriately

### Tablet (768x1024)
- [ ] Layouts adapt to 2-column
- [ ] Navigation is usable
- [ ] Forms are still functional

### Mobile (375x667)
- [ ] Single column layout
- [ ] Navigation stacks or scrolls
- [ ] Forms are usable
- [ ] Text is readable

---

## Performance Testing

### Page Load Times
- [ ] Dashboard: < 2 seconds
- [ ] Prediction: < 1 second
- [ ] Batch Analysis: < 2 seconds
- [ ] Analytics: < 1 second
- [ ] Live Monitor: < 2 seconds

### API Response Times
- [ ] Health check: < 100ms
- [ ] Statistics: < 500ms
- [ ] Batches (100): < 1 second
- [ ] Prediction: < 500ms
- [ ] Model metrics: < 200ms

### Interaction Responsiveness
- [ ] Button clicks: instant feedback
- [ ] Form inputs: no lag
- [ ] Navigation: instant
- [ ] Chart interactions: smooth

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab key navigates through elements
- [ ] Enter key submits forms
- [ ] Escape key closes modals/dropdowns
- [ ] Focus indicators visible

### Screen Reader Compatibility
- [ ] Form labels read correctly
- [ ] Button purposes clear
- [ ] Error messages announced
- [ ] Status updates announced

### Color Contrast
- [ ] Text readable on all backgrounds
- [ ] Links distinguishable
- [ ] Buttons have sufficient contrast
- [ ] Charts use accessible colors

---

## Error Handling Testing

### Backend Down
- [ ] Error message displays
- [ ] User-friendly message shown
- [ ] No console errors break UI
- [ ] Retry mechanism suggested

### Invalid Inputs
- [ ] Form validation works
- [ ] Error messages display
- [ ] User can correct and resubmit
- [ ] No application crash

### Network Timeout
- [ ] Loading spinner shows
- [ ] Timeout error displays after delay
- [ ] User can retry
- [ ] Application remains functional

---

## Security Testing

### Input Sanitization
- [ ] SQL injection attempts blocked
- [ ] XSS attempts don't execute
- [ ] Form inputs validated server-side

### API Security
- [ ] CORS configured correctly
- [ ] No sensitive data in URLs
- [ ] Error messages don't leak info

---

## Final Checklist

### Documentation
- [ ] README.md updated
- [ ] PROJECT_GUIDE.md complete
- [ ] QUICK_START.md clear
- [ ] DLL_FIX_GUIDE.md helpful

### Code Quality
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Consistent formatting
- [ ] TypeScript errors resolved

### Deployment Readiness
- [ ] Environment variables documented
- [ ] Build process works
- [ ] Production mode tested
- [ ] Performance optimized

### User Experience
- [ ] Loading states everywhere
- [ ] Error messages helpful
- [ ] Success feedback clear
- [ ] Navigation intuitive

---

## Sign-Off

**Tester Name:** ___________________

**Date:** ___________________

**Overall Assessment:**
- [ ] All critical features work
- [ ] UI/UX is professional
- [ ] Performance is acceptable
- [ ] Ready for demonstration
- [ ] Ready for submission

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

