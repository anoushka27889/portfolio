#!/usr/bin/env node

/**
 * Memory Leak Monitor for Next.js Dev Server
 *
 * This script:
 * 1. Starts the Next.js dev server
 * 2. Monitors memory usage every 5 seconds
 * 3. Detects memory leak patterns
 * 4. Kills the server and saves logs if a leak is detected
 * 5. Provides analysis of the memory leak
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const MONITOR_INTERVAL = 5000; // Check memory every 5 seconds
const MEMORY_THRESHOLD_MB = 1500; // Kill server if it exceeds this (MB)
const LEAK_DETECTION_SAMPLES = 10; // Number of samples to analyze for leak pattern
const LEAK_INCREASE_THRESHOLD = 0.15; // 15% increase over time indicates leak
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, `memory-monitor-${Date.now()}.log`);

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

let devServer = null;
let memoryHistory = [];
let logStream = null;
let monitorInterval = null;

// Initialize log file
function initLog() {
  logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });
  log('='.repeat(80));
  log('Memory Leak Monitor Started');
  log(`Timestamp: ${new Date().toISOString()}`);
  log(`PID: ${process.pid}`);
  log(`Memory Threshold: ${MEMORY_THRESHOLD_MB} MB`);
  log(`Monitoring Interval: ${MONITOR_INTERVAL}ms`);
  log('='.repeat(80));
}

// Log to both console and file
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  if (logStream) {
    logStream.write(logMessage + '\n');
  }
}

// Get memory usage for a process
function getMemoryUsage(pid) {
  return new Promise((resolve, reject) => {
    // Use ps command to get memory info for the process
    const ps = spawn('ps', ['-o', 'rss=,vsz=', '-p', pid]);
    let output = '';

    ps.stdout.on('data', (data) => {
      output += data.toString();
    });

    ps.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ps command failed with code ${code}`));
        return;
      }

      const parts = output.trim().split(/\s+/);
      if (parts.length >= 2) {
        resolve({
          rss: parseInt(parts[0]) / 1024, // Convert KB to MB
          vsz: parseInt(parts[1]) / 1024, // Convert KB to MB
        });
      } else {
        reject(new Error('Could not parse memory info'));
      }
    });
  });
}

// Analyze memory history for leak patterns
function detectMemoryLeak() {
  if (memoryHistory.length < LEAK_DETECTION_SAMPLES) {
    return null;
  }

  // Get the last N samples
  const recentSamples = memoryHistory.slice(-LEAK_DETECTION_SAMPLES);
  const firstSample = recentSamples[0];
  const lastSample = recentSamples[recentSamples.length - 1];

  // Calculate trend
  const memoryIncrease = lastSample.rss - firstSample.rss;
  const percentIncrease = memoryIncrease / firstSample.rss;
  const timeElapsed = (lastSample.timestamp - firstSample.timestamp) / 1000; // seconds

  // Check if memory is consistently increasing
  let consistentIncrease = true;
  for (let i = 1; i < recentSamples.length; i++) {
    if (recentSamples[i].rss < recentSamples[i - 1].rss - 50) { // Allow 50MB variance
      consistentIncrease = false;
      break;
    }
  }

  // Detect leak
  if (consistentIncrease && percentIncrease > LEAK_INCREASE_THRESHOLD) {
    return {
      detected: true,
      percentIncrease: (percentIncrease * 100).toFixed(2),
      memoryIncrease: memoryIncrease.toFixed(2),
      timeElapsed: timeElapsed.toFixed(0),
      ratePerSecond: (memoryIncrease / timeElapsed).toFixed(2),
      samples: recentSamples,
    };
  }

  return null;
}

// Monitor memory usage
async function monitorMemory() {
  if (!devServer || !devServer.pid) {
    return;
  }

  try {
    const memory = await getMemoryUsage(devServer.pid);
    const timestamp = Date.now();

    memoryHistory.push({
      timestamp,
      rss: memory.rss,
      vsz: memory.vsz,
    });

    log(`Memory: RSS=${memory.rss.toFixed(2)} MB, VSZ=${memory.vsz.toFixed(2)} MB`);

    // Check for memory threshold breach
    if (memory.rss > MEMORY_THRESHOLD_MB) {
      log('');
      log('🔴 CRITICAL: Memory threshold exceeded!');
      log(`Current memory: ${memory.rss.toFixed(2)} MB`);
      log(`Threshold: ${MEMORY_THRESHOLD_MB} MB`);
      await killServerAndAnalyze('Memory threshold exceeded');
      return;
    }

    // Check for memory leak pattern
    const leak = detectMemoryLeak();
    if (leak) {
      log('');
      log('🔴 MEMORY LEAK DETECTED!');
      log(`Memory increased by ${leak.memoryIncrease} MB (${leak.percentIncrease}%)`);
      log(`Time elapsed: ${leak.timeElapsed} seconds`);
      log(`Leak rate: ${leak.ratePerSecond} MB/second`);
      await killServerAndAnalyze('Memory leak pattern detected', leak);
    }

  } catch (error) {
    log(`Error monitoring memory: ${error.message}`);
  }
}

// Generate memory leak analysis
function analyzeMemoryLeak(leak) {
  log('');
  log('='.repeat(80));
  log('MEMORY LEAK ANALYSIS');
  log('='.repeat(80));

  if (leak) {
    log('');
    log('Leak Statistics:');
    log(`  - Total increase: ${leak.memoryIncrease} MB`);
    log(`  - Percent increase: ${leak.percentIncrease}%`);
    log(`  - Time period: ${leak.timeElapsed} seconds`);
    log(`  - Leak rate: ${leak.ratePerSecond} MB/second`);
    log(`  - Samples analyzed: ${leak.samples.length}`);
    log('');
    log('Memory Timeline:');
    leak.samples.forEach((sample, index) => {
      const relativeTime = ((sample.timestamp - leak.samples[0].timestamp) / 1000).toFixed(0);
      log(`  ${index + 1}. [+${relativeTime}s] ${sample.rss.toFixed(2)} MB`);
    });
  }

  log('');
  log('Common Memory Leak Causes in React/Next.js:');
  log('  1. Event listeners not cleaned up in useEffect');
  log('  2. Timers (setTimeout/setInterval) not cleared');
  log('  3. Canvas elements not properly disposed');
  log('  4. Video/Audio elements not released');
  log('  5. Large objects stored in refs or state');
  log('  6. Closures holding references to large objects');
  log('  7. IntersectionObserver/ResizeObserver not disconnected');
  log('  8. Websocket connections not closed');
  log('');
  log('Recommended Actions:');
  log('  1. Check components/AutoplayVideo.tsx for video cleanup');
  log('  2. Check components/ImageGallery.tsx for canvas cleanup');
  log('  3. Check components/CursorFlower.tsx for event listener cleanup');
  log('  4. Review all useEffect hooks for proper cleanup functions');
  log('  5. Use Chrome DevTools Memory Profiler for detailed analysis');
  log('');
  log('Full memory history saved to: ' + LOG_FILE);
  log('='.repeat(80));
}

// Kill server and save analysis
async function killServerAndAnalyze(reason, leak = null) {
  log('');
  log('🛑 Stopping dev server...');
  log(`Reason: ${reason}`);

  // Stop monitoring
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
  }

  // Analyze the leak
  analyzeMemoryLeak(leak);

  // Save full memory history
  log('');
  log('Saving full memory history...');
  const historyFile = path.join(LOG_DIR, `memory-history-${Date.now()}.json`);
  fs.writeFileSync(historyFile, JSON.stringify(memoryHistory, null, 2));
  log(`Memory history saved to: ${historyFile}`);

  // Kill the dev server
  if (devServer) {
    devServer.kill('SIGTERM');

    // Force kill after 5 seconds if still running
    setTimeout(() => {
      if (devServer) {
        log('Force killing dev server...');
        devServer.kill('SIGKILL');
      }
    }, 5000);
  }

  // Close log stream
  if (logStream) {
    logStream.end();
  }

  log('');
  log('Monitor stopped. Check the logs for details.');
  log(`Log file: ${LOG_FILE}`);

  process.exit(1);
}

// Start the dev server
function startDevServer() {
  log('');
  log('Starting Next.js dev server...');

  devServer = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..'),
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  log(`Dev server PID: ${devServer.pid}`);

  // Forward dev server output
  devServer.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log(`[DEV] ${output}`);
    }
  });

  devServer.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log(`[DEV ERROR] ${output}`);
    }
  });

  devServer.on('close', (code) => {
    log(`Dev server exited with code ${code}`);
    if (monitorInterval) {
      clearInterval(monitorInterval);
    }
    if (logStream) {
      logStream.end();
    }
  });

  // Start monitoring after server has started (wait 10 seconds)
  setTimeout(() => {
    log('');
    log('Starting memory monitoring...');
    monitorInterval = setInterval(monitorMemory, MONITOR_INTERVAL);
  }, 10000);
}

// Handle process termination
process.on('SIGINT', async () => {
  log('');
  log('Received SIGINT, shutting down gracefully...');
  await killServerAndAnalyze('Manual shutdown (SIGINT)');
});

process.on('SIGTERM', async () => {
  log('');
  log('Received SIGTERM, shutting down gracefully...');
  await killServerAndAnalyze('Manual shutdown (SIGTERM)');
});

// Main
initLog();
startDevServer();
