import * as shell from "shelljs";

console.log('Copying files..');
shell.cp("-R", "src/assets", "dist/src");
shell.cp("-R", "node_modules", "dist/src");
shell.cp("src/task.json", "dist/src/task.json");
shell.cp("-R", "test/assets", "dist/test");
