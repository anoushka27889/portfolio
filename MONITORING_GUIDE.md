# Monitoring Guide

This guide explains how to use the monitoring tools to debug the "the-other-side" page timeout issue.

## What We've Added

### 1. Client-Side Monitoring

#### PerformanceMonitor Component
- **Location**: `components/PerformanceMonitor.tsx`
- **Logs**:
  - Page mount/unmount times
  - Memory usage (heap size)
  - Video element detection and loading states
  - Image loading
  - Long tasks (>50ms)
  - Resource loading (videos, images)

#### NavigationTracker Component
- **Location**: `components/NavigationTracker.tsx`
- **Logs**:
  - Navigation timing and type
  - Referrer (where you came from)
  - DOM node count
  - Compilation detection (checks for Next.js recompiling indicator)
  - Page interactive time

#### PageLoadDebugger Component
- **Location**: `components/PageLoadDebugger.tsx`
- **Added to**: `app/the-other-side/page.tsx`
- **Logs**:
  - Detailed video analysis (readyState, networkState, buffering)
  - Video event tracking (loadstart, error, playing, etc.)
  - Memory pressure detection
  - React component state
  - Render loop detection

### 2. Server-Side Monitoring

#### Next.js Config
- **Location**: `next.config.ts`
- **Logs**:
  - Webpack compilation start/end
  - Compilation duration
  - File changes that trigger recompilation
  - Errors and warnings

#### Dev Script with Monitoring
- **Location**: `scripts/dev-with-monitoring.sh`
- **Usage**: `./scripts/dev-with-monitoring.sh`
- **Monitors**:
  - File system changes
  - Node.js memory usage
  - High memory warnings

## How to Use

### Step 1: Start the Dev Server with Monitoring

```bash
# Option 1: Use the monitoring script (recommended)
./scripts/dev-with-monitoring.sh

# Option 2: Regular dev server (still has monitoring)
npm run dev
```

### Step 2: Open Browser Console

1. Open Chrome DevTools (Cmd+Option+I)
2. Go to Console tab
3. Make sure "Preserve log" is checked (so logs don't clear on navigation)
4. Filter by log level if needed

### Step 3: Reproduce the Issue

1. Go to `http://localhost:3000` (homepage)
2. Watch the console - you'll see logs like:
   ```
   [PERF] 🚀 Page mounted: /
   [NAV] 🧭 Navigation to: /
   [PERF] 🎬 Video elements found: 0
   ```

3. Click on "The Other Side" project or navigate to `/the-other-side`
4. Watch for:
   - **Navigation logs**: `[NAV]` prefix
   - **Performance logs**: `[PERF]` prefix
   - **Debug logs**: `[DEBUG the-other-side]` prefix
   - **Webpack logs**: `[WEBPACK]` prefix (in terminal)

### Step 4: Look for These Key Indicators

#### Signs of Compilation Loop:
```
[NAV] ⚠️  COMPILATION DETECTED - Next.js is recompiling!
[WEBPACK] 🔄 File changed: ...
```
If you see repeated compilation logs, that's your issue.

#### Signs of Memory Issues:
```
[PERF] ⚠️  HIGH MEMORY USAGE: 85%
[MEMORY] Next.js using 1200MB
```

#### Signs of Video Loading Issues:
```
[DEBUG the-other-side] 🎬 Video 1 event: stalled
[DEBUG the-other-side] ❌ Video 1 error: ...
```

#### Signs of Infinite Renders:
```
[DEBUG the-other-side] ⚠️  Possible infinite render loop detected
```

## What to Look For

### Scenario 1: Direct Load Works, Navigation Doesn't

If the page works when you go directly to `localhost:3000/the-other-side` but times out when navigating from homepage, look for:

1. **Different navigation type**:
   ```
   [NAV] 📊 Navigation timing: { type: 'navigate' }  // Direct
   [NAV] 📊 Navigation timing: { type: 'push' }      // From homepage
   ```

2. **Cleanup issues**: Check if videos from homepage are being properly cleaned up:
   ```
   [PERF] 🏁 Page unmounting: /
   [PERF] 🎬 Video elements found: X  // Should show videos being removed
   ```

3. **Memory not being released**:
   ```
   [PERF] 💾 Memory at unmount: { used: "XXX MB" }
   [PERF] 💾 Memory usage: { used: "YYY MB" }  // Should not be much higher
   ```

### Scenario 2: Compilation Loop

If you see repeated compilation:
```
[WEBPACK] 🔄 File changed: /path/to/file
[WEBPACK] 🔨 Compilation started
```

This means something is triggering hot reload. Common causes:
- File system changes during build
- Circular dependencies
- File watchers detecting public folder changes

### Scenario 3: Video Loading Bottleneck

Look for:
```
[DEBUG the-other-side] 📹 Video 1: { networkState: 'NETWORK_LOADING' }
[DEBUG the-other-side] 📹 Video 2: { networkState: 'NETWORK_LOADING' }
[DEBUG the-other-side] 📹 Video 3: { networkState: 'NETWORK_LOADING' }
```

If multiple videos are loading simultaneously, they might be blocking each other.

## Analyzing the Output

### Example Good Flow:
```
[NAV] 🧭 Navigation to: /the-other-side
[PERF] 🚀 Page mounted: /the-other-side
[DEBUG the-other-side] 🎬 Total videos: 3
[DEBUG the-other-side] 📹 Video 1: { readyState: 'HAVE_ENOUGH_DATA' }
[DEBUG the-other-side] ✅ Component stable after 1234.56ms
[NAV] ✅ Page fully interactive at 1500.00ms
```

### Example Bad Flow (Compilation Loop):
```
[NAV] 🧭 Navigation to: /the-other-side
[WEBPACK] 🔨 Compilation started
[NAV] ⚠️  COMPILATION DETECTED
[WEBPACK] 🔄 File changed: ...
[WEBPACK] 🔨 Compilation started  // ← Repeated compilation!
[NAV] ⚠️  COMPILATION DETECTED
// (stuck in loop)
```

### Example Bad Flow (Memory Issue):
```
[NAV] 🧭 Navigation to: /the-other-side
[PERF] 💾 Memory: { percentUsed: "92%" }  // ← High memory!
[DEBUG the-other-side] ⚠️  HIGH MEMORY USAGE: 92%
[PERF] 🎬 Video 1: { networkState: 'NETWORK_LOADING' }
// (page hangs)
```

## Next Steps Based on Findings

1. **If it's a compilation loop**:
   - Check the file path being changed
   - May need to exclude certain directories from watch

2. **If it's memory**:
   - Videos might not be cleaning up properly
   - Check AutoplayVideo component cleanup

3. **If it's video loading**:
   - May need to implement lazy loading
   - Or load videos sequentially instead of parallel

4. **If it's something else**:
   - The detailed logs will help identify the issue
   - Share the console output for further analysis

## Disabling Monitoring

To disable monitoring, comment out these lines in `app/layout.tsx`:
```tsx
// <PerformanceMonitor />
// <NavigationTracker />
```

And in `app/the-other-side/page.tsx`:
```tsx
// <PageLoadDebugger pageName="the-other-side" />
```
