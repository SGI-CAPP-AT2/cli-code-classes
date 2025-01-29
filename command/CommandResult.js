export class CommandResult {
  /**
   * This is super class of all command results.
   * @param {boolean} status
   * @param {String} message
   */
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}
export class FailedCommandResult extends CommandResult {
  /**
   * This represents failed command result.
   * @param {String} message
   */
  constructor(message) {
    super(false, message);
  }
}
export class SuccessCommandResult extends CommandResult {
  /**
   * This represents successful command result.
   * @param {String} message
   */
  constructor(message) {
    super(true, message);
  }
}
