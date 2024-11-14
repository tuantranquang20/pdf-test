#!/usr/bin/env bun

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
    .version('1.0.0')
    .description('CLI tool for generating modules, controllers and services');

program
    .command('generate <type> <name>')
    .description('Generate a new module, controller, or service')
    .action((type, name) => {
        const moduleDir = path.join(process.cwd(), name);

        if (type === 'module') {
            console.error('options updating');
        } else if (type === 'controller') {
            generateController(name);
        } else if (type === 'service') {
            generateService(name);
        } else {
            console.error('Unknown type. "controller", or "service".');
        }
    });

// List command



function generateController(name: string) {
    const controllerFile = path.join(process.cwd(), `modules/${name}/${name}.controller.ts`);
    if (fs.existsSync(controllerFile)) {
        console.error(`Controller ${name} already exists.`);
        return;
    }

    fs.writeFileSync(controllerFile, generateControllerTemplate(name));
    console.log(`Controller ${name} generated successfully.`);
}

function generateService(name: string) {
    const serviceFile = path.join(process.cwd(), `modules/${name}/${name}.service.ts`);
    if (fs.existsSync(serviceFile)) {
        console.error(`Service ${name} already exists.`);
        return;
    }

    fs.writeFileSync(serviceFile, generateServiceTemplate(name));
    console.log(`Service ${name} generated successfully.`);
}


function generateControllerTemplate(name: string): string {
    return `
  import { BaseController, Get } from "@utils/index";

  class ${capitalize(name)}Controller extends BaseController {
  
    constructor(){
        super(/${lowerCase(name)});
    }
    
    @Get()
    findAll() {
      return 'This action returns all ${name.toLowerCase()}';
    }
  }
  export default new ${capitalize(name)}Controller().start();
  `;
}

function generateServiceTemplate(name: string): string {
    return `
  export class ${capitalize(name)}Service {
    getHello(): string {
      return 'Hello from ${name}Service!';
    }
  }
  `;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowerCase(str:string){
    return str.toLowerCase()
}

program.parse(process.argv);