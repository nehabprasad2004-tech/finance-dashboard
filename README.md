# FinFlow - Finance Dashboard

FinFlow is a financial dashboard built to help users track and manage their transactions in a simple and visual way.

## Why I Built It This Way

I chose React because of its inbuilt component library which makes it easy to build and manage different parts of the UI independently. Each section of the dashboard like the summary cards, charts, and transaction table are all separate components that work together cleanly.

For charts I used Recharts, which works naturally with React and made it straightforward to display financial data visually.

## What It Does

FinFlow gives you a clear overview of your financial activity through:

- Summary cards showing your total balance, income, and expenses at a glance
- Charts that show your balance trend over time and how your spending is distributed across categories
- An insights section that does monthly comparisons and highlights your top spending category
- A full transactions list where you can search, filter, and sort your data
- Role based access where Admin can add, edit and delete transactions while Viewer can only see the data
- Dark and light mode toggle

## Tech Stack

- React
- Recharts for data visualization
- Plain CSS in JS for styling

## Getting Started

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

## Data

The app runs on mock data which means all transactions are sample data defined in the code itself. There is no backend or database needed. This was intentional as the focus of this project is on the frontend experience.

## Role Based UI

| Feature            | Admin | Viewer |
|--------------------|-------|--------|
| View Dashboard     | ✅    | ✅     |
| View Transactions  | ✅    | ✅     |
| Add Transaction    | ✅    | ❌     |
| Edit Transaction   | ✅    | ❌     |
| Delete Transaction | ✅    | ❌     |
| View Insights      | ✅    | ✅     |

You can switch between roles using the dropdown in the bottom left of the sidebar.

## State Management

State is handled using React's built in useState and useMemo hooks. No external library like Redux was needed since the app state is straightforward and manageable with React alone.

Things tracked in state include the transactions list, active tab, search input, filters, sort order, selected role, and the dark or light mode preference.