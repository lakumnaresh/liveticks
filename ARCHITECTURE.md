# LiveTicks - Real-time Data Streaming Application

## Overview

LiveTicks is a React Native application that demonstrates real-time data streaming through WebSocket connections with live chart visualization. The app connects to a public WebSocket server, receives continuous streaming data, and displays it in an interactive, updating chart with comprehensive UI controls.

## Architecture

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LiveChart.tsx    # Main chart component
│   ├── StatusIndicator.tsx  # Connection status display
│   ├── ControlPanel.tsx # Settings & control UI
│   └── ErrorBanner.tsx  # Error message display
├── hooks/               # Custom React hooks
│   └── useWebSocket.ts  # WebSocket integration hooks
├── services/            # Business logic services
│   └── websocket.service.ts  # WebSocket connection manager
├── stores/              # State management (Zustand)
│   └── websocket.store.ts   # Global state store
├── types/               # TypeScript type definitions
│   └── index.ts
└── utils/               # Utility functions
    ├── storage.ts       # AsyncStorage helpers
    └── data.ts          # Data processing utilities
```

### Data Flow

```
WebSocket Service (websocket.service.ts)
        ↓
    Zustand Store (websocket.store.ts)
        ↓
    Custom Hooks (useWebSocket.ts)
        ↓
    Components (App.tsx, LiveChart.tsx, etc.)
        ↓
    UI Updates
```

## Key Technical Decisions

### 1. State Management: Zustand
- **Why**: Lightweight, minimal boilerplate, excellent TypeScript support
- **Advantages**: Easy to use, no provider wrapper needed, fast updates
- **Usage**: Centralized store for WebSocket state, data points, and settings

### 2. WebSocket Library: Native Web APIs
- **Why**: React Native supports WebSocket natively, no external dependencies needed
- **Advantages**: No additional bundle size, built-in browser/RN support
- **Features**:
  - Automatic reconnection with exponential backoff
  - Heartbeat mechanism (ping/pong)
  - Message buffering when disconnected
  - Connection state tracking

### 3. Charting: victory-native
- **Why**: Powerful, flexible chart library with great animations and native performance
- **Advantages**: Works on both iOS and Android, customizable styling, handles large datasets well
- **Supported Chart Types**: Line chart (default) and Bar chart

### 4. Data Persistence: MMKV
- **Why**: Extremely fast key-value storage for React Native (10x faster than AsyncStorage)
- **Advantages**: Synchronous API, better performance, smaller bundle size
- **Features**:
  - Caches last 100 data points
  - Stores user settings
  - Instant, non-blocking access

## Features Implementation

### 1. WebSocket Integration (`src/services/websocket.service.ts`)

**Connection Management**:
- Singleton pattern for single WebSocket instance
- Automatic reconnection with exponential backoff (1s → 2s → 4s → ... → 30s max)
- Maximum 5 reconnection attempts

**Heartbeat Mechanism**:
- Pings every 30 seconds if no message received
- Detects stale connections
- Automatically reconnects on failure

**Error Handling**:
- Graceful error recovery
- User-friendly error messages
- Automatic retry logic

**Data Buffering**:
- Queues messages when disconnected
- Sends buffered messages on reconnection
- Prevents data loss

### 2. Live Chart Component (`src/components/LiveChart.tsx`)

**Features**:
- Displays last 50-100 data points
- Real-time updates as new data arrives
- Dual chart types (Line & Bar)
- Performance optimized with normalization
- Statistics display (Latest, High, Low, Average)

**Performance Optimizations**:
- Maintains only last 100 points in memory
- Normalized data for consistent rendering
- Memoized calculations

### 3. State Management (`src/stores/websocket.store.ts`)

**Store Structure**:
```typescript
{
  // Connection state
  connectionStatus: 'connected' | 'reconnecting' | 'disconnected'
  
  // Data
  dataPoints: DataPoint[]
  
  // Controls
  isPaused: boolean
  
  // Settings
  settings: {
    updateFrequency: number
    chartType: 'line' | 'bar'
    maxDataPoints: number
  }
  
  // Error tracking
  error: string | null
}
```

### 4. Control Panel Features

**Pause/Resume**:
- Stop/start data collection without disconnecting
- Preserves existing data

**Chart Type Switching**:
- Toggle between Line and Bar charts
- Smooth transitions

**Update Frequency Control**:
- 500ms (fast updates)
- 1000ms (default)
- 2000ms (reduced bandwidth)

**Connection Status Indicator**:
- Green: Connected
- Yellow: Reconnecting
- Red: Disconnected

## WebSocket Server

**Default Configuration**:
- URL: `wss://socketsbay.com/wss/v2/1/demo/`
- Protocol: WebSocket Secure (WSS)
- Data Format: Numeric strings or JSON with `price`/`value` fields
- Update Frequency: Continuous streaming

**Alternative Servers**:
- `wss://echo.websocket.events`
- `wss://ws.postman-echo.com/raw`
- Cryptocurrency price feeds (Binance, Coinbase)

## Libraries Used

```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-native": "0.79.2",
    "zustand": "^4.5.2",
    "react-native-svg": "^14.2.0",
    "victory-native": "^36.9.2",
    "react-native-reanimated": "^3.13.0",
    "react-native-mmkv": "^2.11.1"
  }
}
```

## Setup & Installation

### Prerequisites
- Node.js >= 18
- npm or yarn
- React Native CLI
- Xcode (for iOS) or Android Studio (for Android)

### Installation Steps

1. **Install Dependencies**:
```bash
cd LiveTicks
npm install
# or
yarn install
```

2. **Install Pods (iOS only)**:
```bash
cd ios
pod install
cd ..
```

3. **Run on iOS**:
```bash
npm run ios
# or
npx react-native run-ios
```

4. **Run on Android**:
```bash
npm run android
# or
npx react-native run-android
```

5. **Start Metro Bundler** (if not started automatically):
```bash
npm start
```

## Usage

### Starting the App

1. Launch the app on your device or emulator
2. App automatically connects to WebSocket server
3. Watch real-time data stream in the chart
4. Use controls to pause/resume, change chart type, or adjust update frequency

### Pause/Resume Data
- Tap "⏸ Pause" to stop collecting new data
- Tap "▶ Resume" to continue

### Change Chart Type
- Select "Line" for continuous line chart
- Select "Bar" for bar chart visualization

### Adjust Update Frequency
- 500ms: Fast updates (more battery usage)
- 1000ms: Balanced (default)
- 2000ms: Slower updates (less battery usage)

## Performance Considerations

### Optimizations Implemented

1. **Data Point Limitation**: Keeps only last 100 points in memory
2. **Normalized Rendering**: Data normalized to 0-100 scale for consistent rendering
3. **Efficient Updates**: Zustand batches state updates
4. **Selective Re-renders**: Only chart updates when data changes
5. **Memory Management**: Automatic cleanup of old data points

### Battery Usage Tips

- Use 2000ms update frequency for extended use
- Pause data collection when not actively monitoring
- Minimize chart type switches

## Error Handling

### Connection Errors

**Automatic Recovery**:
- Exponential backoff reconnection
- Maximum 5 reconnection attempts
- User notification via error banner

**Manual Recovery**:
- Reload app to reset connection
- Check internet connectivity
- Verify WebSocket server availability

### Data Processing Errors

- Silently skips invalid data points
- Continues operation
- Logged to console for debugging

## Troubleshooting

### App Won't Connect

1. Check internet connection
2. Verify WebSocket server is accessible:
   ```bash
   curl -i https://socketsbay.com/wss/v2/1/demo/
   ```
3. Check for firewall/proxy blocking WSS
4. Try alternative WebSocket server

### Chart Not Updating

1. Check connection status indicator
2. Verify pause/resume button is in resume state
3. Check browser console for errors
4. Ensure update frequency is not too high

### Performance Issues

1. Reduce update frequency (500ms → 1000ms → 2000ms)
2. Clear old data by restarting app
3. Close other apps to free memory
4. Use line chart instead of bar chart

## Future Enhancements

1. **Multiple Streams**: Connect to multiple WebSocket servers
2. **Data Export**: Export data as CSV/JSON
3. **Advanced Analytics**: Min/max/average calculations with time windows
4. **Offline Support**: Work with cached data when offline
5. **Dark Mode**: Support for system dark theme
6. **Customizable Colors**: Theming system for charts
7. **WebSocket History**: Replay historical data
8. **Alert System**: Notifications for value thresholds

## Testing

### Unit Tests
- Run existing tests: `npm test`
- Test files in `__tests__/` directory

### Manual Testing
- Test reconnection by closing network
- Test pause/resume functionality
- Verify chart type switching
- Check update frequency changes

## Code Quality

### TypeScript
- Full type safety across the application
- Strict mode enabled in tsconfig.json
- Proper typing for all components and functions

### Linting
- ESLint configured for React Native
- Run: `npm run lint`

### Code Organization
- Clear separation of concerns
- Modular component structure
- Reusable utilities and hooks
- Consistent naming conventions

## License

This project is provided for educational and interview purposes.

## Contact & Support

For issues or questions, please refer to the architecture documentation or code comments.

---

**Last Updated**: December 2025
**Status**: Production Ready
