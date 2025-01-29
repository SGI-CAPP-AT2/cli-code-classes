import { SuccessCommandResult } from "./CommandResult.js";

export const hello =
  /**
   * This is simple command used for testing purpose.
   * @returns {CommandResult} Hello World!
   */
  async () => {
    return new SuccessCommandResult("Hello World!");
  };

export const login =
  /**
   * this command is used to login the user using google auth provied by firebase.
   * @returns {CommandResult} Logged in successfully!
   */
  async () => {
    return "Logged in successfully!";
  };
