import open from "open";
import {
  AUTH_URL,
  INSTALL_DIR,
  LOGIN_PORT,
  USER_DETAILS_DIR,
  USER_DETAILS_FILE,
  USER_TOKEN_FILE,
} from "../GLOBALS.js";
import { ServerConfig } from "../server/ServerConfig.js";
import { ServerPath } from "../server/ServerPath.js";
import { startServer } from "../server/start.js";
import { PendingCommandResult, SuccessCommandResult } from "./CommandResult.js";
import { existsSync, mkdir, mkdirSync, writeFileSync } from "fs";
import path from "path";
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
    const pendingRes = new PendingCommandResult(
      "Login is available at " + process.env.AUTH_URL,
      {
        onCompleteTask: () => {
          process.exit(0);
        },
      }
    );
    const listenForTokenAt = new ServerPath("/auth-success", (req, res) => {
      const token = req.query.token;
      const userInfo = req.query.user;
      if (!existsSync(USER_DETAILS_DIR)) mkdirSync(USER_DETAILS_DIR);
      writeFileSync(USER_DETAILS_FILE, userInfo);
      writeFileSync(USER_TOKEN_FILE, token);
      const deSerializedUser = JSON.parse(userInfo);
      res.statusCode = 200;
      res.end(
        "You can close this tab now.Logged in as: " +
          deSerializedUser.displayName
      );
      return userInfo;
    });
    listenForTokenAt.onCompleteTask((val) => {
      console.log("Logged in as: " + JSON.parse(val).displayName);

      pendingRes.complete();
    });
    const serverConfig = new ServerConfig({
      paths: [listenForTokenAt],
      port: LOGIN_PORT,
    });
    startServer(serverConfig);
    open(AUTH_URL);
    return pendingRes;
  };
