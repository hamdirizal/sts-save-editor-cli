import { helpCommand } from "./src/commands/helpCommand.js";
import { seeRelicsCommand } from "./src/commands/seeRelicsCommand.js";

const renderHr = () => {
  console.info('_'.repeat(90))
}

const args = process.argv.slice(2);
renderHr();
if(args[0]=== 'help'){
  helpCommand();
}
else if (args[0] === 'see_relics') {
  seeRelicsCommand();
}
else {
  helpCommand();
}
renderHr();