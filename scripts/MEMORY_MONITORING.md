# Memory Monitoring Tools

This directory contains scripts to monitor and detect memory leaks in the Next.js dev server.

## Quick Start

### Run dev server with memory monitoring:
```bash
npm run dev:monitor
```

This will:
- Start the Next.js dev server
- Monitor memory usage every 5 seconds
- Automatically detect memory leak patterns
- Kill the server and save logs if a leak is detected
- Provide detailed analysis of the leak

### Analyze existing logs:
```bash
npm run analyze-memory
```

## How It Works

### Memory Monitoring (`monitor-memory.js`)

The monitor tracks:
- **RSS (Resident Set Size)**: Actual physical memory used
- **VSZ (Virtual Size)**: Virtual memory allocated

**Leak Detection Algorithm:**
1. Collects memory samples every 5 seconds
2. Analyzes the last 10 samples for patterns
3. Detects a leak if:
   - Memory increases consistently (monotonic growth)
   - Total increase is > 15% over the sample period
   - No significant drops in memory usage

**Automatic Actions:**
- Kills server if memory exceeds 1500 MB (configurable)
- Kills server if leak pattern is detected
- Saves detailed logs and memory history

### Configuration

You can adjust these constants in `monitor-memory.js`:

```javascript
const MONITOR_INTERVAL = 5000;              // Check every 5 seconds
const MEMORY_THRESHOLD_MB = 1500;           // Kill at 1500 MB
const LEAK_DETECTION_SAMPLES = 10;          // Analyze 10 samples
const LEAK_INCREASE_THRESHOLD = 0.15;       // 15% increase = leak
```

## Log Files

Logs are saved to `logs/` directory:

### `memory-monitor-{timestamp}.log`
Human-readable log with:
- Memory usage over time
- Leak detection alerts
- Analysis and recommendations
- Dev server output

### `memory-history-{timestamp}.json`
JSON data with all memory samples:
```json
[
  {
    "timestamp": 1706198400000,
    "rss": 234.5,
    "vsz": 1234.5
  },
  ...
]
```

## Understanding the Output

### Normal Memory Usage
```
[2026-01-25T...] Memory: RSS=234.50 MB, VSZ=1234.50 MB
[2026-01-25T...] Memory: RSS=236.20 MB, VSZ=1235.10 MB
[2026-01-25T...] Memory: RSS=235.80 MB, VSZ=1234.90 MB
```
Memory fluctuates but stays relatively stable.

### Memory Leak Detected
```
🔴 MEMORY LEAK DETECTED!
Memory increased by 156.32 MB (45.23%)
Time elapsed: 50 seconds
Leak rate: 3.13 MB/second
```

The monitor will then:
1. Stop the server
2. Save all logs
3. Provide analysis and recommendations

## Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Make sure you're in the project root directory

### Memory monitoring not working
- Ensure you're on macOS/Linux (uses `ps` command)
- Check that the script has execute permissions:
  ```bash
  chmod +x scripts/monitor-memory.js
  ```

### False positive leak detection
If you're getting false positives:
1. Increase `LEAK_INCREASE_THRESHOLD` (e.g., to 0.25 = 25%)
2. Increase `LEAK_DETECTION_SAMPLES` (e.g., to 15 samples)
3. Increase `MONITOR_INTERVAL` (e.g., to 10000ms = 10 seconds)

## Common Memory Leak Causes

The monitor will check for these common issues:

1. **Event listeners not cleaned up**
   - Missing cleanup in `useEffect` return functions

2. **Timers not cleared**
   - `setTimeout`/`setInterval` without cleanup

3. **Canvas elements**
   - Not properly disposed after use

4. **Video/Audio elements**
   - Not released when component unmounts

5. **Large objects in refs**
   - Storing too much data in `useRef`

6. **Observer APIs**
   - `IntersectionObserver`, `ResizeObserver` not disconnected

## Example Workflow

1. **Start monitoring:**
   ```bash
   npm run dev:monitor
   ```

2. **Use your app normally:**
   - Navigate between pages
   - Interact with components
   - Let it run for a few minutes

3. **If leak detected:**
   - Server will auto-kill
   - Check the logs for analysis
   - Fix the identified issues

4. **Analyze logs:**
   ```bash
   npm run analyze-memory
   ```

5. **Review the memory growth rate:**
   - 🟢 < 0.5 MB/s = Normal
   - 🟡 0.5-1 MB/s = Watch closely
   - 🔴 > 1 MB/s = Critical leak

## Tips

- Run the monitor when testing new features
- Keep monitoring logs to compare before/after fixes
- Use Chrome DevTools Memory Profiler for detailed component analysis
- Monitor production builds too (use `npm run build && npm start`)

## Clean Up Logs

To remove old logs:
```bash
rm -rf logs/
```

The directory will be recreated automatically on next run.
