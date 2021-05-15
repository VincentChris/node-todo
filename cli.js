#!/usr/bin/env node
const api = require("./api");
const { Command } = require("commander");
const program = new Command();

program.version("0.0.1");

if (process.argv.length === 2) {
  return api.showAll();
}
program
  .command("add <args...>")
  .description("add a task")
  .action((args) => {
    api.add(args.join(" "));
  });

program
  .command("clear")
  .description("clear all task")
  .action(() => {
    api.clear().then(() => {
      console.log("清除成功");
    });
  });

program.parse(process.argv);
