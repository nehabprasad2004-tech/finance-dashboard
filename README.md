<<<<<<< HEAD
# FinFlow - Finance Dashboard

A clean and interactive finance dashboard built with React for tracking and understanding financial activity.

## Live Features

- **Dashboard Overview** - Summary cards showing Total Balance, Income, and Expenses with charts
- **Transactions Section** - Full list of transactions with search, filter, and sort
- **Insights Section** - Spending patterns, top categories, and monthly comparisons
- **Role Based UI** - Switch between Admin and Viewer roles using the dropdown in the sidebar
- **Dark / Light Mode** - Toggle between dark and light themes

## Tech Stack

- **React** - Frontend framework
- **Recharts** - For all charts and visualizations
- **Plain CSS-in-JS** - Styling using inline style objects, no external CSS library

## Getting Started

### Prerequisites
- Node.js installed on your machine

### Installation

1. Clone the repository
   ```
   git clone https://github.com/nehabprasad2004-tech/finance-dashboard.git
   ```

2. Go into the project folder
   ```
   cd finance-dashboard
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Install Recharts
   ```
   npm install recharts
   ```

5. Start the app
   ```
   npm start
   ```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
  App.js        # Main file containing all components and logic
  index.js      # Entry point
```

## Data

All data is mock data defined directly in the code. No backend or API is required. The app uses 30 sample transactions across 3 months (January to March 2024).

## Role Based UI

| Feature              | Admin | Viewer |
|----------------------|-------|--------|
| View Dashboard       | ✅    | ✅     |
| View Transactions    | ✅    | ✅     |
| Add Transaction      | ✅    | ❌     |
| Edit Transaction     | ✅    | ❌     |
| Delete Transaction   | ✅    | ❌     |
| View Insights        | ✅    | ✅     |

Switch roles using the dropdown in the bottom left sidebar.

## State Management

State is managed using React's built-in `useState` and `useMemo` hooks. No external state library like Redux is used as the app complexity does not require it.

The following state is tracked:
- Transactions data
- Active tab
- Search text
- Category and type filters
- Sort key and direction
- Selected role
- Dark / Light mode
- Modal open/close

## Assumptions

- Data is mock and resets on page refresh
- Role switching is for demonstration purposes only, no authentication is implemented
- All amounts are in USD
-
=======
# finance-dashboard
>>>>>>> bd93d4a9b71c2f77010fba2a050ae5526fdd9849
