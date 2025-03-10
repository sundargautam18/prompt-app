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

  // Step 2: Ask for Project Type (Allow multi-select)
  const projectTypeSpinner = ora("Waiting for project type...").start();
  const { projectType } = await inquirer.prompt([
    {
      type: "checkbox", // Multi-select for project type
      name: "projectType",
      message:
        "What type of project are you creating? (Select multiple if needed)",
      choices: ["Frontend", "Backend", "Full Stack"],
    },
  ]);
  projectTypeSpinner.stop();

  step.projectType = projectType; // Store the project type(s)
  updateStepPreview(step);

  // Step 3: Ask for Framework Based on Type (Allow multi-select)
  let frameworkChoices = [];
  if (projectType.includes("Frontend")) {
    frameworkChoices = ["React", "Vue", "Svelte", "Next.js"];
  }
  if (projectType.includes("Backend")) {
    frameworkChoices = [...frameworkChoices, "Express.js", "NestJS", "Fastify"];
  }
  if (projectType.includes("Full Stack")) {
    frameworkChoices = [
      ...frameworkChoices,
      "Next.js (Full Stack)",
      "Nuxt.js (Full Stack)",
      "Remix",
    ];
  }

  const frameworkSpinner = ora("Waiting for framework choices...").start();
  const { framework } = await inquirer.prompt([
    {
      type: "checkbox", // Multi-select for frameworks
      name: "framework",
      message:
        "Choose frameworks for your project (Select multiple if needed):",
      choices: frameworkChoices,
    },
  ]);
  frameworkSpinner.stop();

  step.framework = framework; // Store the selected frameworks
  updateStepPreview(step);

  // Debugging log
  console.log(`📌 Debug: Project Name -> ${projectName}`);
  console.log(`📌 Debug: Project Type(s) -> ${projectType.join(", ")}`);
  console.log(`📌 Debug: Framework(s) -> ${framework.join(", ")}`);

  // Step 4: Recommend Installation Command
  if (framework.length === 0) {
    console.log("❌ Error: No frameworks selected.");
    process.exit(1);
  }

  console.log("\n✅ Recommended command to create your project:");

  framework.forEach((fw) => {
    let installCommand = "";

    // Determine the installation command based on selected framework
    if (fw === "React") {
      installCommand = `npx create-react-app ${projectName}`;
    } else if (fw === "Vue") {
      installCommand = `npm init vue@latest ${projectName}`;
    } else if (fw === "Svelte") {
      installCommand = `npx degit sveltejs/template ${projectName}`;
    } else if (fw === "Next.js") {
      installCommand = `npx create-next-app@latest ${projectName}`;
    } else if (fw === "Express.js") {
      installCommand = `mkdir ${projectName} && cd ${projectName} && npm init -y && npm install express`;
    } else if (fw === "NestJS") {
      installCommand = `npx @nestjs/cli new ${projectName}`;
    } else if (fw === "Fastify") {
      installCommand = `mkdir ${projectName} && cd ${projectName} && npm init fastify@latest`;
    } else if (fw === "Next.js (Full Stack)") {
      installCommand = `npx create-next-app@latest ${projectName}`;
    } else if (fw === "Nuxt.js (Full Stack)") {
      installCommand = `npx nuxi init ${projectName}`;
    } else if (fw === "Remix") {
      installCommand = `npx create-remix@latest ${projectName}`;
    } else {
      console.error("❌ Error: Framework not recognized.");
      process.exit(1);
    }

    // Output the installation command for each selected framework
    console.log(`\n> ${installCommand}\n`);
  });
}

// Run the CLI
main().catch((err) => console.error("Error:", err));
