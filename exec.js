import { CommandResult } from "./command/CommandResult.js";
import * as commands from "./command/commands.js";
import { CommandInput } from "./models/CommanInput.js";
import { User } from "./models/User.js";
import { init } from "./setup/init.js";
import { writeOutput } from "./utils/command_outputs.js";
import { getUserDetailsFromCache } from "./utils/user_details.js";

export const execute = async (args) => {
  const _command = args[2];
  const _args = args.slice(3);

  // command is available
  if (commands[_command]) {
    init(_command);
    /**
     * @type {CommandResult}
     */
    const args = _args;
    const user = getUserDetailsFromCache();
    const _res = await commands[_command](
      new CommandInput({
        args,
        user,
      })
    );
    console.log(writeOutput(_res));
    _res.printed();
  }
  // command is not available
  else {
    console.error(`Command "${_command}" not found`);
  }
};
