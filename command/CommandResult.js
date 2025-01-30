import { Colors } from "../utils/Colors.js";

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
}
export class FailedCommandResult extends CommandResult {
  /**
   * This represents failed command result.
   * @param {String} message
   */
  constructor(message, obj) {
    this.color = Colors.RED;
    super(false, message, obj);
  }
}
export class SuccessCommandResult extends CommandResult {
  /**
   * This represents successful command result.
   * @param {String} message
   * @param {{warning:String}} obj
   */
  constructor(message, obj) {
    this.color = Colors.GREEN;
    super(true, message, obj);
  }
}
export class PendingCommandResult extends CommandResult {
  /**
   * This represents pending commands
   * @param {{warning:String}} obj
   */
  constructor(message, { warning, onCompleteTask }) {
    super(false, message);
    this.___onCompleteTask = onCompleteTask;
    this.warning = warning;
    this.color = Colors.YELLOW;
  }

  complete() {
    this.status = true;
    this.___onCompleteTask();
  }
}
