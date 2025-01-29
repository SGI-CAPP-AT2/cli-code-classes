import * as commands from "./commands.js";

export const execute = async (args) => {
  const _command = args[2];
  const _args = args.slice(3);

  // command is aviailable
  if (commands[_command]) {
    const _res = await commands[_command](_args);
    console.log(_res);
  }
  // command is not available
  else {
    console.error(`Command "${_command}" not found`);
  }
};
