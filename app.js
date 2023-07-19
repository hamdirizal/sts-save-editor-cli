import { helpCommand } from "./src/commands/helpCommand.js";

const renderHr = () => {
  console.info('____________________________________________________________')
}

const args = process.argv.slice(2);
renderHr();
if(args[0]=== 'help'){
  helpCommand();
}
else {
  helpCommand();
}
renderHr();