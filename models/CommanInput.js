import { User } from "./User.js";

export class CommandInput {
  /**
   *
   * @param {{ user:User, args:Array<string> }} param0
   */
  constructor({ user, args }) {
    this.user = user;
    this.args = args;
  }
}
