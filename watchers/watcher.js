import chokidar from "chokidar";
import { execFile } from "child_process";
import path from "path";
import fs from 'fs';

// Configurable environment variables
const watchDirectory = process.env.WATCH_DIRECTORY || "/workspace/app"; // Directory to watch
const syncScriptPath = path.resolve("/workspace/app/sync.sh"); // Path to sync script
const parsedInterval = parseInt(process.env.SYNC_INTERVAL_MINUTES, 10);
const intervalMinutes = Number.isNaN(parsedInterval) ? 10 : parsedInterval; // Interval in minutes, default is 10

let changes = []; // To keep track of file changes
let lastSyncTime = Date.now(); // Time when the sync script last ran

// Helper function for logging with timestamp
function logWithTimestamp(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Function to run the sync script safely
function runSyncScript() {
  logWithTimestamp("Running sync script...");
  
  // Ensure the script path exists
  if (!fs.existsSync(syncScriptPath)) {
    console.error(`Sync script does not exist at path: ${syncScriptPath}`);
    return;
  }

  execFile("/bin/sh", [syncScriptPath], (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running sync script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Sync script stderr: ${stderr}`);
    }
    console.log(`Sync script output: ${stdout}`);
  });
}

// Start watching the directory for changes
const watcher = chokidar.watch(watchDirectory, { persistent: true });

watcher
  .on("add", (filePath) => {
    logWithTimestamp(`File added: ${filePath}`);
    changes.push({ type: "add", path: filePath, timestamp: Date.now() });
  })
  .on("change", (filePath) => {
    logWithTimestamp(`File changed: ${filePath}`);
    changes.push({ type: "change", path: filePath, timestamp: Date.now() });
  })
  .on("unlink", (filePath) => {
    logWithTimestamp(`File removed: ${filePath}`);
    changes.push({ type: "unlink", path: filePath, timestamp: Date.now() });
  })
  .on("error", (error) => console.error(`[${new Date().toISOString()}] Watcher error: ${error}`));

// Check for changes and run the sync script every interval
setInterval(() => {
  const now = Date.now();
  
  // Check if any file changes occurred in the last interval
  const changesInLastInterval = changes.filter(change => now - change.timestamp <= intervalMinutes * 60 * 1000);

  if (changesInLastInterval.length > 0) {
    logWithTimestamp(`Changes detected in the last ${intervalMinutes} minutes. Running sync script...`);
    runSyncScript();
  } else {
    logWithTimestamp(`No changes detected in the last ${intervalMinutes} minutes.`);
  }

}, intervalMinutes * 60 * 1000);

// Graceful shutdown handling
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

function handleShutdown() {
  logWithTimestamp("Stopping watcher and exiting...");
  watcher.close();
  process.exit(0);
}
