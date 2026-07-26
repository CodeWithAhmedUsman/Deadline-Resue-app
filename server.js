import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import handler from "./api/ai-plan.js";

const port = process.env.PORT || 3000;
const root = process.cwd();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

createServer(async (request, response) => {
  if (request.url === "/api/ai-plan" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    request.body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    return handler(request, {
      status(code) {
        response.statusCode = code;
        return this;
      },
      json(payload) {
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.end(JSON.stringify(payload));
      }
    });
  }

  const url = new URL(request.url, `http://localhost:${port}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = join(root, pathname.replace(/^\/+/, ""));

  try {
    const file = await readFile(filePath);
    response.setHeader("Content-Type", mimeTypes[extname(filePath)] || "application/octet-stream");
    response.end(file);
  } catch (error) {
    response.statusCode = 404;
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`Deadline Rescue is running at http://localhost:${port}`);
});
