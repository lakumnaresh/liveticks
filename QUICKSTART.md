# Quick Start Guide - LiveTicks

## 📦 Installation (2 minutes)

### Step 1: Install Dependencies
```bash
cd LiveTicks
npm install
```

### Step 2: Install iOS Pods (Mac only)
```bash
cd ios
pod install
cd ..
```

### Step 3: Run the App

**iOS**:
```bash
npm run ios
```

**Android**:
```bash
npm run android
```

That's it! The app should launch and automatically connect to the WebSocket server.

---

## 🎯 What to Expect

1. **App Launches** → Blank screen with "Waiting for data..."
2. **Connection Established** → Status turns 🟢 green and says "Connected"
3. **Data Arrives** → Chart starts filling with real-time data
4. **Auto-Updates** → Chart continuously updates with new data points

---

## 🎮 How to Use

### Control Panel (bottom of screen)

| Button | Effect |
|--------|--------|
| **⏸ Pause** | Stops collecting new data |
| **▶ Resume** | Restarts data collection |

### Chart Type
- **Line**: Smooth line chart (default)
- **Bar**: Bar chart visualization

### Update Frequency
- **500ms**: Very fast updates
- **1000ms**: Balanced (default)
- **2000ms**: Slower, saves battery

---

## 📊 Reading the Chart

```
┌─────────────────────────────┐
│ Latest │ High │ Low │ Avg   │  ← Statistics
├─────────────────────────────┤
│                             │
│    ╱╲                       │
│   ╱  ╲    ╱╲                │  ← Line chart
│  ╱    ╲  ╱  ╲               │
│ ╱      ╲╱    ╲              │
└─────────────────────────────┘
     50 data points displayed
```

---

## 🌐 WebSocket Server

**Connected to**: `wss://socketsbay.com/wss/v2/1/demo/`

This public server sends random numeric values. The app displays them in real-time.

---

## 🔴 Troubleshooting

### App Won't Connect

```bash
# Check if server is accessible
curl https://socketsbay.com

# If that fails, try alternative server:
# Edit: src/services/websocket.service.ts
# Change URL to: wss://echo.websocket.events
```

### Chart Not Updating

1. Check status indicator (should be 🟢 green)
2. Check pause button is in resume state
3. Open developer console (Flip keyboard up)

### Slow Performance

1. Reduce update frequency to 2000ms
2. Restart the app
3. Close other apps

---

## 📱 Testing Checklist

- [ ] App launches without errors
- [ ] Status shows "Connected" (🟢)
- [ ] Chart displays data
- [ ] Pause button stops updates
- [ ] Resume button restarts updates
- [ ] Chart type switching works
- [ ] Update frequency changes work

---

## 🆘 Still Not Working?

1. **Force restart**: 
   ```bash
   npm start -- --reset-cache
   ```

2. **Clean rebuild**:
   ```bash
   cd ios && rm -rf Pods && pod install && cd ..
   npm run ios
   ```

3. **Check logs**:
   - Look at Xcode console (iOS) or Android Studio logcat

4. **Try alternative server** in `src/services/websocket.service.ts`

---

## 📖 Next Steps

1. Read `ARCHITECTURE.md` for deep dive
2. Explore source code in `src/` folder
3. Try changing WebSocket server in config
4. Experiment with different update frequencies

---

## 🎓 Learning Outcomes

After using this app, you'll understand:

✅ WebSocket real-time communication  
✅ React Native state management  
✅ TypeScript for type safety  
✅ Custom hooks and reusable components  
✅ Real-time data visualization  
✅ Connection management & reconnection  
✅ Error handling and recovery  

---

## ⚙️ Common Customizations

### Change WebSocket Server

**File**: `src/services/websocket.service.ts`

```typescript
const DEFAULT_CONFIG: WebSocketConfig = {
  url: 'YOUR_NEW_URL_HERE', // ← Change this
  // ... rest of config
};
```

### Change Default Chart Type

**File**: `src/stores/websocket.store.ts`

```typescript
settings: {
  chartType: 'bar', // ← Change from 'line' to 'bar'
  // ... rest
}
```

### Change Chart Height

**File**: `App.tsx`

```typescript
<LiveChart
  data={dataPoints}
  type={settings.chartType}
  height={400} // ← Change height here (default: 300)
/>
```

---

## 💡 Pro Tips

1. **Monitor battery**: Use 2000ms update frequency for extended use
2. **Check connectivity**: Connection indicator changes color instantly
3. **Review statistics**: Charts show Latest/High/Low/Average values
4. **Smooth transitions**: Animations are hardware-accelerated
5. **Mobile optimized**: Works great on phones and tablets

---

## 🚀 Ready to Dive Deeper?

Check out:
- `ARCHITECTURE.md` - Complete architecture documentation
- `src/hooks/useWebSocket.ts` - Custom hook implementation
- `src/services/websocket.service.ts` - WebSocket logic
- `src/stores/websocket.store.ts` - State management

---

**Happy coding! 🎉**

For issues, check the main README.md or ARCHITECTURE.md
