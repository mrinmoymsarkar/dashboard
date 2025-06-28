# Indian Stock Market Dashboard

A real-time Indian stock market dashboard built with Next.js, featuring live stock data, interactive charts, and a responsive design.

## Features

- 📊 Real-time stock data for major Indian stocks and indices
- 📈 Interactive price charts with multiple time ranges
- 🔍 Stock search functionality
- 🌙 Dark/Light theme toggle
- 📱 Responsive design for all devices
- ⚡ WebSocket support with API polling fallback

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data**: Yahoo Finance API
- **Real-time**: WebSocket with API polling fallback
- **Deployment**: Vercel-ready

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Start the WebSocket server** (optional, for real-time data):
   ```bash
   npm run ws
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run ws` - Start WebSocket server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Deployment to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "New Project"**

4. **Import your GitHub repository**

5. **Configure the project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `dashboard` (since your Next.js app is in the dashboard folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. **Environment Variables** (if needed):
   - Add any required environment variables in the Vercel dashboard
   - Go to Project Settings → Environment Variables

7. **Deploy**: Click "Deploy"

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to the dashboard directory**:
   ```bash
   cd dashboard
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts** to complete deployment

### Important Notes for Vercel Deployment

- **WebSocket Server**: The WebSocket server (`ws-server.ts`) won't run on Vercel as it's a serverless platform. The app automatically falls back to API polling mode.
- **Real-time Data**: In production, the app uses API polling every 30 seconds to fetch stock data.
- **API Routes**: All API routes (`/api/search`, `/api/quote`, `/api/stocks/realtime`) work on Vercel.

## Architecture

### Frontend Components

- **Market Overview Cards**: Display real-time stock prices and changes
- **Price Chart**: Interactive charts using Recharts
- **Stock Search**: Search functionality for Indian stocks
- **Time Range Selector**: Chart time period selection
- **Theme Toggle**: Dark/Light mode switching

### API Routes

- `/api/search` - Stock search functionality
- `/api/quote` - Get stock quotes and historical data
- `/api/stocks/realtime` - Real-time stock data for polling fallback

### Data Flow

1. **Development**: WebSocket server provides real-time data
2. **Production**: API polling fetches data every 30 seconds
3. **Fallback**: If WebSocket fails, automatically switches to polling

## Environment Variables

Create a `.env.local` file in the dashboard directory:

```env
# Optional: Custom API keys or configuration
CUSTOM_KEY=your_custom_key_here
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed
2. **API Errors**: Check Yahoo Finance API availability
3. **WebSocket Issues**: App automatically falls back to polling

### Performance Optimization

- The app uses Next.js 15 with Turbopack for faster development
- Static optimization is enabled for better performance
- API routes are configured with appropriate cache headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
