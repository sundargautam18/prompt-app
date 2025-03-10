{
"name": "create-aitc",
"version": "1.0.1",
"description": "A CLI tool to scaffold a new project",
"bin": {
"project": "index.js"
},
"type": "module",
"dependencies": {
"inquirer": "^12.4.3"
}
}

Here if you link , then on npm create aitc, it will execute project bin. which executes index.js. you can add any name to the bin but for create to work : create-your_preffered_name
