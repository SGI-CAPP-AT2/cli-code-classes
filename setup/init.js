import fs from "fs";
import { APP_DIR, USER_DETAILS_DIR } from "../GLOBALS.js";
export const init = (command) => {
  fs.existsSync(APP_DIR) || fs.mkdirSync(APP_DIR);
  // Initialize for login command
  command === "login" &&
    !fs.existsSync(USER_DETAILS_DIR) &&
    fs.mkdirSync(USER_DETAILS_DIR);
};
