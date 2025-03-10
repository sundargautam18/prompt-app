#!/usr/bin/env node

import inquirer from "inquirer";

async function main() {
  console.log("🚀 Welcome to Create MyApp!");

  // Step 1: Ask for Project Name
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "my-app",
    },
  ]);

  // Step 2: Ask for Project Type
  const { projectType } = await inquirer.prompt([
    {
      type: "list",
      name: "projectType",
      message: "What type of project are you creating?",
      choices: ["Frontend", "Backend", "Full Stack"],
    },
  ]);

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

  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: `Choose a ${projectType} framework:`,
      choices: frameworkChoices,
    },
  ]);

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
  }
n
  console.log("\n✅ Recommended command to create your project:");
  console.log(`\n> ${installCommand}\n`);
}

main().catch((err) => console.error("Error:", err));
