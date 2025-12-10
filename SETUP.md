# LiveTicks - Real-time Data Streaming App

A React Native application demonstrating real-time data streaming via WebSocket with live chart visualization, state management, and professional UI/UX.

## ✨ Features

- ✅ **Real-time WebSocket Integration**
  - Connects to public WebSocket server
  - Automatic reconnection with exponential backoff
  - Heartbeat mechanism (ping/pong)
  - Connection status tracking

- ✅ **Live Chart Visualization**
  - Real-time updating line/bar charts
  - Last 100 data points displayed
  - Statistics display (Latest, High, Low, Average)
  - Smooth performance optimizations

- ✅ **Interactive Controls**
  - Pause/Resume data streaming
  - Switch between chart types
  - Adjustable update frequency (500ms, 1s, 2s)
  - Connection status indicator

- ✅ **Professional Architecture**
  - TypeScript for type safety
  - Zustand for state management
  - Clean component structure
  - Reusable hooks and utilities

- ✅ **Bonus Features**
  - WebSocket heartbeat mechanism
  - Multiple chart types
  - Configurable update frequency
  - AsyncStorage for data persistence
  - Comprehensive error handling

## 📱 Requirements

- **Node.js**: >= 18
- **npm** or **yarn**
- **React Native CLI**: Latest version
- **iOS**: Xcode 14+ (Mac required)
- **Android**: Android Studio with SDK 21+

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd LiveTicks
npm install
```

### 2. Install Pods (iOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Start Development

#### iOS
```bash
npm run ios
```
Or:
```bash
npx react-native run-ios
```

#### Android
```bash
npm run android
```
Or:
```bash
npx react-native run-android
```

#### Manually Start Metro Bundler
```bash
npm start
```

## 📖 How to Use

### Starting the App

1. Launch the app on your device or emulator
2. App automatically connects to WebSocket server
3. Watch live data streaming in the chart
4. Use control panel to manage data collection

### Controls

| Control | Action |
|---------|--------|
| **Pause/Resume** | Stop/start data collection |
| **Chart Type** | Switch between Line and Bar charts |
| **Update Frequency** | Change data update speed (500ms, 1s, 2s) |
| **Status Indicator** | Shows connection state |

### Connection States

- 🟢 **Connected**: Actively receiving data
- 🟡 **Reconnecting**: Attempting to re-establish connection
- 🔴 **Disconnected**: No connection to server

## 🏗️ Project Structure

```
LiveTicks/
├── src/
│   ├── components/              # UI Components
│   │   ├── LiveChart.tsx        # Chart display
│   │   ├── StatusIndicator.tsx  # Connection status
│   │   ├── ControlPanel.tsx     # Settings controls
│   │   └── ErrorBanner.tsx      # Error display
│   ├── hooks/                   # Custom hooks
│   │   └── useWebSocket.ts      # WebSocket hooks
│   ├── services/                # Business logic
│   │   └── websocket.service.ts # WebSocket handler
│   ├── stores/                  # State management
│   │   └── websocket.store.ts   # Zustand store
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   └── utils/                   # Utility functions
│       ├── storage.ts           # AsyncStorage
│       └── data.ts              # Data processing
├── App.tsx                      # Main app component
├── package.json
├── tsconfig.json
├── ARCHITECTURE.md              # Architecture documentation
└── README.md                    # This file
```

## 🔧 Configuration

### WebSocket Server

**Default Configuration**:
```typescript
{
  url: 'wss://socketsbay.com/wss/v2/1/demo/',
  reconnectAttempts: 5,
  initialReconnectDelay: 1000,    // 1 second
  maxReconnectDelay: 30000,       // 30 seconds
  heartbeatInterval: 30000        // 30 seconds
}
```

### Alternative Servers

You can change the WebSocket server in `src/services/websocket.service.ts`:

```typescript
const DEFAULT_CONFIG: WebSocketConfig = {
  url: 'YOUR_WEBSOCKET_URL', // Change this
  // ... other config
};
```

**Tested Servers**:
- `wss://socketsbay.com/wss/v2/1/demo/` ⭐ Recommended
- `wss://echo.websocket.events`
- `wss://ws.postman-echo.com/raw`
- Cryptocurrency feeds (Binance, Coinbase)

## 📊 Data Format

The app accepts data in multiple formats:

**1. Simple numeric strings**:
```
42.5
100.25
```

**2. JSON with `price` or `value` field**:
```json
{"price": 42.5}
{"value": 100.25}
{"data": {"price": 50}}
```

The WebSocket service automatically parses and normalizes data.

## 🎨 UI Components

### LiveChart
Displays real-time data with statistics.
- Automatic data normalization
- Configurable height
- Line and bar chart support
- Stats display (Latest, High, Low, Average)

### StatusIndicator
Shows WebSocket connection status.
- Color-coded status (green/yellow/red)
- Real-time updates

### ControlPanel
Interactive controls for data management.
- Pause/Resume button
- Chart type selector
- Update frequency options

### ErrorBanner
Displays error messages when issues occur.
- Auto-dismisses on recovery
- User-friendly error text

## 🚨 Error Handling

### Automatic Recovery

The app automatically handles:
- Network disconnections
- WebSocket server unavailability
- Invalid data formats
- Connection timeouts

### Manual Recovery

If issues persist:
1. Check internet connectivity
2. Verify WebSocket server is online
3. Restart the app
4. Try alternative WebSocket server

## ⚡ Performance

### Optimizations

- **Limited Data Points**: Keeps only last 100 data points in memory
- **Normalized Rendering**: Scales data to 0-100 for consistent rendering
- **Efficient State Updates**: Zustand batches updates automatically
- **Selective Re-renders**: Only affected components update
- **Memory Management**: Automatic cleanup of old data

### Battery Usage Tips

1. Use 2000ms update frequency for extended sessions
2. Pause data collection when not actively monitoring
3. Minimize app switches
4. Use line charts (more performant than bar)

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing Checklist

- [ ] App connects to WebSocket on launch
- [ ] Data updates in real-time
- [ ] Pause button stops data collection
- [ ] Resume button resumes data collection
- [ ] Chart type switching works smoothly
- [ ] Update frequency changes take effect
- [ ] Reconnection works after network loss
- [ ] Error messages display correctly
- [ ] Statistics (High, Low, Avg) are accurate
- [ ] App doesn't crash on invalid data

## 📚 Technical Stack

| Technology | Purpose |
|-----------|---------|
| React Native | Mobile app framework |
| TypeScript | Type safety |
| Zustand | State management |
| React Native SVG Charts | Data visualization |
| React Native Reanimated | Smooth animations |
| AsyncStorage | Local data persistence |
| WebSocket API | Real-time communication |

## 🔍 Debugging

### Console Logging

All WebSocket events are logged:
```
WebSocket connected
Attempting to reconnect... (1/5)
Heartbeat: No message received, checking connection...
Error processing message: ...
```

### Redux DevTools (Optional)

To add Redux DevTools support, modify `websocket.store.ts`:

```typescript
import { devtools } from 'zustand/middleware';

export const useWebSocketStore = create<WebSocketStore>(
  devtools((set) => ({
    // ... store implementation
  }))
);
```

## 📖 Documentation

- **ARCHITECTURE.md**: Detailed architecture and design decisions
- **README.md**: This file (quick start and overview)
- **Code Comments**: Inline documentation in source files

## 🐛 Common Issues

### Issue: "Cannot find module 'zustand'"

**Solution**: Install dependencies
```bash
npm install
```

### Issue: App won't connect to WebSocket

**Solution**: Check internet and server availability
```bash
# Test server connectivity
curl -i https://socketsbay.com/wss/v2/1/demo/
```

### Issue: Chart not updating

**Solution**: Verify app state
1. Check connection status indicator (should be green)
2. Ensure pause button is in resume state
3. Check console for error messages

### Issue: Slow performance

**Solution**: Reduce update frequency
1. Open Control Panel
2. Change to 2000ms update frequency
3. Switch to line chart

## 🎓 Learning Resources

### WebSocket
- [MDN WebSocket Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [WebSocket Best Practices](https://www.rfc-editor.org/rfc/rfc6455)

### React Native
- [React Native Docs](https://reactnative.dev/)
- [React Native Navigation](https://reactnative.dev/docs/navigation)

### State Management
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ✅ Checklist for Production

- [ ] Test on real devices (iOS & Android)
- [ ] Test reconnection logic with poor network
- [ ] Verify memory usage with large datasets
- [ ] Test on different screen sizes
- [ ] Verify error handling edge cases
- [ ] Performance profile with React Native DevTools
- [ ] Test with different WebSocket servers
- [ ] Verify battery impact
- [ ] Update documentation if needed
- [ ] Review security (certificate validation for WSS)

## 🤝 Contributing

This is an interview assignment. For modifications or improvements:

1. Maintain TypeScript strict mode
2. Follow existing code style
3. Add comments for complex logic
4. Update documentation

## 📝 License

For educational and interview purposes.

---

## 🎯 Key Features Demonstrated

✅ WebSocket integration with reconnection  
✅ Real-time data visualization  
✅ Professional state management  
✅ Clean code architecture  
✅ TypeScript type safety  
✅ Comprehensive UI/UX  
✅ Error handling and recovery  
✅ Performance optimization  
✅ Custom hooks and utilities  
✅ Responsive design  

## 📞 Support

For questions or issues:
1. Check ARCHITECTURE.md for detailed documentation
2. Review code comments in source files
3. Check troubleshooting section above
4. Verify WebSocket server availability

---

**Status**: ✅ Production Ready  
**Last Updated**: December 2025  
**Version**: 1.0.0
