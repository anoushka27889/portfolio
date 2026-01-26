#!/usr/bin/env node

/**
 * Memory Log Analyzer
 *
 * Analyzes memory monitor logs and provides insights
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');

// Get all log files
function getLogFiles() {
  if (!fs.existsSync(LOG_DIR)) {
    console.log('No logs directory found.');
    return [];
  }

  const files = fs.readdirSync(LOG_DIR);
  const logFiles = files.filter(f => f.startsWith('memory-monitor-') && f.endsWith('.log'));
  const historyFiles = files.filter(f => f.startsWith('memory-history-') && f.endsWith('.json'));

  return { logFiles, historyFiles };
}

// Parse memory history JSON
function analyzeMemoryHistory(file) {
  const filePath = path.join(LOG_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (data.length === 0) {
    return null;
  }

  const first = data[0];
  const last = data[data.length - 1];
  const duration = (last.timestamp - first.timestamp) / 1000; // seconds

  // Find peak memory
  let peak = data[0];
  let valley = data[0];
  let totalMemory = 0;

  data.forEach(sample => {
    if (sample.rss > peak.rss) peak = sample;
    if (sample.rss < valley.rss) valley = sample;
    totalMemory += sample.rss;
  });

  const avgMemory = totalMemory / data.length;
  const memoryIncrease = last.rss - first.rss;
  const percentIncrease = (memoryIncrease / first.rss) * 100;

  return {
    samples: data.length,
    duration: duration.toFixed(0),
    startMemory: first.rss.toFixed(2),
    endMemory: last.rss.toFixed(2),
    peakMemory: peak.rss.toFixed(2),
    valleyMemory: valley.rss.toFixed(2),
    avgMemory: avgMemory.toFixed(2),
    memoryIncrease: memoryIncrease.toFixed(2),
    percentIncrease: percentIncrease.toFixed(2),
    growthRate: (memoryIncrease / duration).toFixed(2),
  };
}

// Main
console.log('='.repeat(80));
console.log('Memory Log Analyzer');
console.log('='.repeat(80));
console.log('');

const { logFiles, historyFiles } = getLogFiles();

if (logFiles.length === 0 && historyFiles.length === 0) {
  console.log('No memory logs found.');
  console.log('Run "npm run dev:monitor" to start monitoring.');
  process.exit(0);
}

// Display text logs
if (logFiles.length > 0) {
  console.log(`Found ${logFiles.length} log file(s):`);
  console.log('');

  logFiles.forEach((file, index) => {
    const timestamp = file.replace('memory-monitor-', '').replace('.log', '');
    const date = new Date(parseInt(timestamp));
    console.log(`${index + 1}. ${file}`);
    console.log(`   Created: ${date.toLocaleString()}`);
  });

  console.log('');
  console.log('To view a log file:');
  console.log(`  cat logs/${logFiles[logFiles.length - 1]}`);
  console.log('');
}

// Analyze history files
if (historyFiles.length > 0) {
  console.log('='.repeat(80));
  console.log('Memory History Analysis');
  console.log('='.repeat(80));
  console.log('');

  historyFiles.forEach((file, index) => {
    const timestamp = file.replace('memory-history-', '').replace('.json', '');
    const date = new Date(parseInt(timestamp));
    const analysis = analyzeMemoryHistory(file);

    console.log(`${index + 1}. ${file}`);
    console.log(`   Created: ${date.toLocaleString()}`);

    if (analysis) {
      console.log(`   Samples: ${analysis.samples}`);
      console.log(`   Duration: ${analysis.duration}s`);
      console.log(`   Start Memory: ${analysis.startMemory} MB`);
      console.log(`   End Memory: ${analysis.endMemory} MB`);
      console.log(`   Peak Memory: ${analysis.peakMemory} MB`);
      console.log(`   Avg Memory: ${analysis.avgMemory} MB`);
      console.log(`   Memory Growth: ${analysis.memoryIncrease} MB (${analysis.percentIncrease}%)`);
      console.log(`   Growth Rate: ${analysis.growthRate} MB/s`);

      // Leak assessment
      if (parseFloat(analysis.growthRate) > 1) {
        console.log('   🔴 STATUS: CRITICAL LEAK DETECTED');
      } else if (parseFloat(analysis.growthRate) > 0.5) {
        console.log('   🟡 STATUS: Potential leak detected');
      } else if (parseFloat(analysis.percentIncrease) > 20) {
        console.log('   🟡 STATUS: High memory growth');
      } else {
        console.log('   🟢 STATUS: Normal memory behavior');
      }
    }

    console.log('');
  });
}

console.log('='.repeat(80));
console.log('Log Location: ' + LOG_DIR);
console.log('='.repeat(80));
