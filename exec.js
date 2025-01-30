import * as commands from "./command/commands.js";

export const execute = async (args) => {
  const _command = args[2];
  const _args = args.slice(3);

  // command is available
  if (commands[_command]) {
    /**
     * @type {CommandResult}
     */
    const _res = await commands[_command](_args);
    // console[_res.status ? "log" : "err"](_res.message);
  }
  // command is not available
  else {
    console.error(`Command "${_command}" not found`);
  }
};
