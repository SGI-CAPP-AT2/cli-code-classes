import open from "open";
import {
  AUTH_URL,
  LOGIN_PORT,
  PAGES_LOGIN_SUCESS,
  USER_DETAILS_DIR,
  USER_TOKEN_FILE,
} from "../GLOBALS.js";
import { ServerConfig } from "../server/ServerConfig.js";
import { ServerPath } from "../server/ServerPath.js";
import { startServer } from "../server/start.js";
import {
  FailedCommandResult,
  PendingCommandResult,
  SuccessCommandResult,
} from "./CommandResult.js";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { getPage } from "../pages/getPage.js";
import {
  deleteUserDetails,
  getUserDetailsFromCache,
  getUserDetailsFromFetch,
} from "../utils/user_details.js";
import { User } from "../models/User.js";
export const hello =
  /**
   * This is simple command used for testing purpose.
   * @returns {CommandResult} Hello World!
   */
  async () => {
    const cachedDetails = getUserDetailsFromCache();
    const output = `Hello ${cachedDetails ? cachedDetails.name : "World"}!`;
    return new SuccessCommandResult(output);
  };

export const login =
  /**
   * this command is used to login the user using google auth provied by firebase.
   * @param { { user:User } } anonymous_0
   * @returns {CommandResult} Logged in successfully!
   */
  async ({ user }) => {
    if (!user.err) return new FailedCommandResult("Already Logged In !");
    const pendingRes = new PendingCommandResult(
      "Login is available at " + AUTH_URL,
      {
        onCompleteTask: (val) => {
          return "Logged in successfully with email: " + val.email;
        },
        onFailTask: (val) => {
          return "Unable to login " + val;
        },
      }
    );
    setTimeout(() => {
      pendingRes.fail("Timed Out!");
    }, 120 * 1000);
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    const listenForTokenAt = new ServerPath(
      "/auth-success",
      /**
       * @param {import("express").Request} req
       * @param {import("express").Response} res
       */
      async (req, res) => {
        const token = req.query.token;
        res.statusCode = 200;
        if (token) res.redirect("/success");
        else res.redirect("/fail");
        return token;
      }
    );
    const listenForSuccessEnd = new ServerPath(
      "/success",
      /**
       * @param {Request} req
       * @param {import("express").Response} res
       */
      async (req, res) => {
        const userDetails = await getUserDetailsFromFetch();
        res.send(getPage(PAGES_LOGIN_SUCESS, userDetails));
        return userDetails;
      }
    );
    const listenForFailEnd = new ServerPath(
      "/fail",
      /**
       * @param {Request} req
       * @param {import("express").Response} res
       */
      async (req, res) => res.send("Failed to login !")
    );
    listenForTokenAt.onCompleteTask((val) => {
      if (!existsSync(USER_DETAILS_DIR)) mkdirSync(USER_DETAILS_DIR);
      writeFileSync(USER_TOKEN_FILE, val);
    });
    listenForSuccessEnd.onCompleteTask((val) => {
      pendingRes.complete(val);
    });
    listenForFailEnd.onCompleteTask(() => pendingRes.fail("Unable to login"));
    const serverConfig = new ServerConfig({
      paths: [listenForTokenAt, listenForFailEnd, listenForSuccessEnd],
      port: LOGIN_PORT,
    });
    startServer(serverConfig);
    open(AUTH_URL);
    return pendingRes;
  };
export const logout =
  /**
   * this command is used to logout the user.
   * @param {{ user:User }} anonymous_0
   * @returns {CommandResult} Logged in successfully!
   */
  async ({ user }) => {
    const failReturn = new FailedCommandResult(
      "Unable to logout ! May be you're not logged in."
    );
    if (user.err) return failReturn;
    const err = await deleteUserDetails();
    return !err
      ? new SuccessCommandResult("Successfully Logged out !")
      : failReturn;
  };
