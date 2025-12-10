# Quick Commands Reference

## Essential Commands

```bash
# Navigate to project
cd /Users/nareshlakum/Projects/Naresh/Interview/LiveTicks

# Install dependencies
npm install

# Install iOS pods (Mac only)
cd ios && pod install && cd ..

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Start Metro bundler
npm start

# Clear Metro cache
npm start -- --reset-cache

# Run tests
npm test

# Run linter
npm run lint
```

## Next Steps After Installation

1. **Read**: `00-START-HERE.md` (main entry point)
2. **Run**: `npm run ios` or `npm run android`
3. **Explore**: Try all controls in the app
4. **Learn**: Read `ARCHITECTURE.md` for deep dive
5. **Customize**: Modify using `CONFIG_EXAMPLES.md`

## Key Documentation Files

| File | Purpose | Time |
|------|---------|------|
| **00-START-HERE.md** | Entry point & overview | 2 min |
| **QUICKSTART.md** | Install & run guide | 2 min |
| **SETUP.md** | Complete instructions | 10 min |
| **ARCHITECTURE.md** | Design & implementation | 15 min |
| **CONFIG_EXAMPLES.md** | Configuration examples | 5 min |
| **COMPLETION-CHECKLIST.md** | Verify all features | 5 min |
| **INDEX.md** | Navigation guide | 2 min |

## Troubleshooting Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules && npm install

# Reset iOS build
cd ios && rm -rf Pods && pod install && cd ..

# Reset Metro cache
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Check if port 8081 is in use
lsof -i :8081

# Kill process on port 8081
kill -9 $(lsof -t -i :8081)
```

## Common Issues

**Q: Module not found errors?**
```bash
npm install
cd ios && pod install && cd ..
npm start -- --reset-cache
```

**Q: Build errors on iOS?**
```bash
cd ios
rm -rf Pods
pod install
cd ..
npm run ios
```

**Q: Metro bundler issues?**
```bash
npm start -- --reset-cache
```

**Q: Port 8081 already in use?**
```bash
kill -9 $(lsof -t -i :8081)
npm start
```

---

**Ready to start? Run:**
```bash
npm install && cd ios && pod install && cd ..
npm run ios
```

Then read `00-START-HERE.md` for the full guide.
