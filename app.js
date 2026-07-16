import "dotenv/config";
import { validateEnv } from "./helpers/validateEnv.js";

validateEnv();

const { default: Server } = await import("./server/Server.js");

const server = new Server();
server.listen();