import path from "path";

export const LOGIN_PORT = 61109;
export const SERVER_PORT = 3000;
export const AUTH_URL = `http://localhost:${SERVER_PORT}/auth/google`;
export const INSTALL_DIR = import.meta.dirname;
export const USER_DETAILS_DIR = path.join(INSTALL_DIR, ".user");
export const USER_DETAILS_FILE = path.join(USER_DETAILS_DIR, "user.json");
export const USER_TOKEN_FILE = path.join(USER_DETAILS_DIR, ".token");
