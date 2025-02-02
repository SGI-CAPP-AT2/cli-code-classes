import { text } from "express";
import { Colors } from "../utils/Colors.js";
import { writeOutput } from "../utils/command_outputs.js";
import { loaderAnimation } from "../utils/loadingSpinner.js";

export class CommandResult {
  /**
   * This is super class of all command results.
   * @param {boolean} status
   * @param {String} message
   * @param {{warning:String}} obj
   */
  constructor(status, message, { warning } = {}) {
    this.status = status;
    this.message = message;
    this.warning = warning;
    this.color = Colors.NONE;
  }
  printed() {}
}
export class FailedCommandResult extends CommandResult {
  /**
   * This represents failed command result.
   * @param {String} message
   */
  constructor(message, obj) {
    super(false, message, obj);
    this.color = Colors.RED;
  }
}
export class SuccessCommandResult extends CommandResult {
  /**
   * This represents successful command result.
   * @param {String} message
   * @param {{warning:String}} obj
   */
  constructor(message, obj) {
    super(true, message, obj);
    this.color = Colors.GREEN;
  }
}
export class PendingCommandResult extends CommandResult {
  /**
   * This represents pending commands
   * @param {{
   *          warning:String,
   *          onCompleteTask:Function
   *        }} obj
   */
  constructor(message, { warning, onCompleteTask, onFailTask }) {
    super(false, message);
    this.___onCompleteTask = onCompleteTask;
    this.___onFailTask = onFailTask;
    this.warning = warning;
    this.color = Colors.YELLOW;
  }

  complete(val) {
    this.color = Colors.GREEN;
    this.status = true;
    this.message = this.___onCompleteTask(val);
    process.stdout.write("\r" + writeOutput(this));
    process.exit(0);
  }

  fail(val) {
    this.color = Colors.RED;
    this.status = false;
    this.message = this.___onFailTask(val);
    process.stdout.write("\r" + writeOutput(this));
    process.exit(0);
  }

  printed() {
    loaderAnimation({ text: "Loading..." });
  }
}
