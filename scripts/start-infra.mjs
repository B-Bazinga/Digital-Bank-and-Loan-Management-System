import { Socket } from "node:net";
import { spawnSync } from "node:child_process";

function isPortOpen(port, host = "127.0.0.1", timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new Socket();

    const finish = (value) => {
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(timeout);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));

    socket.connect(port, host);
  });
}

const [mongoUp, redisUp] = await Promise.all([isPortOpen(27017), isPortOpen(6379)]);

if (mongoUp && redisUp) {
  console.log("MongoDB and Redis already running locally.");
  process.exit(0);
}

console.log("Starting MongoDB and Redis with Docker Compose...");
const result = spawnSync(
  "docker",
  ["compose", "-f", "backend/docker-compose.yml", "up", "-d", "mongo", "redis"],
  { stdio: "inherit", shell: true }
);

if (result.status === 0) {
  process.exit(0);
}

console.error("\nInfrastructure startup failed.");
console.error("Either start Docker Desktop and re-run npm start,");
console.error("or run local MongoDB (port 27017) and Redis (port 6379).\n");
console.error("Continuing startup without infrastructure. Backend DB routes may fail until services are available.\n");
process.exit(0);
