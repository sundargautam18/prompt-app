#!/usr/bin/env node

import inquirer from "inquirer";
import ora from "ora";

// Function to update the preview of steps with tick marks
function updateStepPreview(step) {
  const stepsPreview = [
    `Project Name: ${step.projectName ? "✅" : "❌"} ${step.projectName || ""}`,
    `Project Type: ${step.projectType ? "✅" : "❌"} ${step.projectType || ""}`,
    `Framework: ${step.framework ? "✅" : "❌"} ${step.framework || ""}`,
  ];

  console.clear(); // Clear the console for a fresh preview
  console.log("🚀 Welcome to Create MyApp!");
  stepsPreview.forEach((line) => console.log(line));
  console.log("\n");
}

async function main() {
  // Step 1: Ask for Project Name without loading spinner at first
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "my-app",
    },
  ]);

  const step = { projectName }; // Store the project name
  updateStepPreview(step);

  // Step 2: Ask for Project Type
  const projectTypeSpinner = ora("Waiting for project type...").start();
  const { projectType } = await inquirer.prompt([
    {
      type: "list",
      name: "projectType",
      message: "What type of project are you creating?",
      choices: ["Frontend", "Backend", "Full Stack"],
    },
  ]);
  projectTypeSpinner.stop();

  step.projectType = projectType; // Store the project type
  updateStepPreview(step);

  // Step 3: Ask for Framework Based on Type
  let frameworkChoices = [];
  if (projectType === "Frontend") {
    frameworkChoices = ["React", "Vue", "Svelte", "Next.js"];
  } else if (projectType === "Backend") {
    frameworkChoices = ["Express.js", "NestJS", "Fastify"];
  } else {
    frameworkChoices = [
      "Next.js (Full Stack)",
      "Nuxt.js (Full Stack)",
      "Remix",
    ];
  }

  const frameworkSpinner = ora("Waiting for framework choices...").start();
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: `Choose a ${projectType} framework:`,
      choices: frameworkChoices,
    },
  ]);
  frameworkSpinner.stop();

  step.framework = framework; // Store the selected framework
  updateStepPreview(step);

  // Debugging log
  console.log(`📌 Debug: Project Name -> ${projectName}`);
  console.log(`📌 Debug: Project Type -> ${projectType}`);
  console.log(`📌 Debug: Framework -> ${framework}`);

  // Step 4: Recommend Installation Command
  let installCommand = "";

  if (framework === "React") {
    installCommand = `npx create-react-app ${projectName}`;
  } else if (framework === "Vue") {
    installCommand = `npm init vue@latest ${projectName}`;
  } else if (framework === "Svelte") {
    installCommand = `npx degit sveltejs/template ${projectName}`;
  } else if (framework === "Next.js") {
    installCommand = `npx create-next-app@latest ${projectName}`;
  } else if (framework === "Express.js") {
    installCommand = `mkdir ${projectName} && cd ${projectName} && npm init -y && npm install express`;
  } else if (framework === "NestJS") {
    installCommand = `npx @nestjs/cli new ${projectName}`;
  } else if (framework === "Fastify") {
    installCommand = `mkdir ${projectName} && cd ${projectName} && npm init fastify@latest`;
  } else if (framework === "Next.js (Full Stack)") {
    installCommand = `npx create-next-app@latest ${projectName}`;
  } else if (framework === "Nuxt.js (Full Stack)") {
    installCommand = `npx nuxi init ${projectName}`;
  } else if (framework === "Remix") {
    installCommand = `npx create-remix@latest ${projectName}`;
  } else {
    console.error("❌ Error: No framework selected.");
    process.exit(1);
  }

  console.log("\n✅ Recommended command to create your project:");
  console.log(`\n> ${installCommand}\n`);
}

// Run the CLI
main().catch((err) => console.error("Error:", err));
