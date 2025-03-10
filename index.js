#!/usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";

async function main() {
  console.log("🔍 WiFi Password Viewer");

  // Ask the user if they want to view WiFi passwords
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose an action",
      choices: ["View WiFi password of current network", "Exit"],
    },
  ]);

  if (action === "Exit") {
    console.log("Goodbye!");
    return;
  }

  // Get current network name (SSID)
  let networkName;
  try {
    if (process.platform === "win32") {
      networkName = getWindowsCurrentNetwork();
    } else if (process.platform === "darwin") {
      networkName = getMacCurrentNetwork();
    } else if (process.platform === "linux") {
      networkName = getLinuxCurrentNetwork();
    }
  } catch (err) {
    console.error("Error getting current network:", err);
    return;
  }

  if (!networkName) {
    console.log("Could not detect connected network.");
    return;
  }

  console.log(`Connected to: ${networkName}`);
  let password;
  try {
    if (process.platform === "win32") {
      password = getWindowsWifiPassword(networkName);
    } else if (process.platform === "darwin") {
      password = getMacWifiPassword(networkName);
    } else if (process.platform === "linux") {
      password = getLinuxWifiPassword(networkName);
    }
  } catch (err) {
    console.error("Error retrieving WiFi password:", err);
    return;
  }

  if (password) {
    console.log(`WiFi Password: ${password}`);
  } else {
    console.log("WiFi password not found.");
  }
}

function getWindowsCurrentNetwork() {
  const command = `netsh wlan show interfaces`;
  let result;
  try {
    result = execSync(command, { encoding: "utf-8" });
    console.log(result); // Debugging output
  } catch (err) {
    console.error("Error executing command:", err);
    throw new Error("Could not fetch current network information.");
  }

  const networkName = result.match(/SSID\s*:\s*(.*)/);
  return networkName ? networkName[1].trim() : null;
}

function getWindowsWifiPassword(networkName) {
  const command = `netsh wlan show profile name="${networkName}" key=clear | findstr /R "^Key Content"`;
  let result;
  try {
    result = execSync(command, { encoding: "utf-8" });
  } catch (err) {
    console.error("Error fetching WiFi password:", err);
    throw new Error("Could not retrieve WiFi password.");
  }

  const password = result.split(":")[1].trim();
  return password || null;
}

function getMacCurrentNetwork() {
  const command = `networksetup -getairportnetwork en0`;
  const result = execSync(command, { encoding: "utf-8" });
  return result.split(":")[1].trim();
}

function getMacWifiPassword(networkName) {
  const command = `security find-generic-password -ga "${networkName}" | grep "password"`;
  const result = execSync(command, { encoding: "utf-8" });
  return result.split("=")[1].trim().replace(/"/g, "");
}

function getLinuxCurrentNetwork() {
  const command = `iwgetid -r`;
  const result = execSync(command, { encoding: "utf-8" });
  return result.trim();
}

function getLinuxWifiPassword(networkName) {
  const command = `sudo grep -r '^psk=' /etc/NetworkManager/system-connections/${networkName} | awk -F= '{print $2}'`;
  const result = execSync(command, { encoding: "utf-8" });
  return result.trim();
}

main().catch((err) => console.error("Error:", err));
