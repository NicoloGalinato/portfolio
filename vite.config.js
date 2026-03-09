import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "src", "assets", "images");

// Ensure the images directory exists
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

/** @type {import('vite').Plugin} */
function cmsAssetsPlugin() {
  return {
    name: "cms-assets",
    configureServer(server) {
      // ── Parse multipart/form-data manually (no extra dep needed) ──
      const parseMultipart = (req) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          req.on("data", (c) => chunks.push(c));
          req.on("end", () => {
            const body = Buffer.concat(chunks);
            const contentType = req.headers["content-type"] || "";
            const boundaryMatch = contentType.match(/boundary=(.+)$/);
            if (!boundaryMatch) return reject(new Error("No boundary"));
            const boundary = Buffer.from("--" + boundaryMatch[1]);
            const parts = [];
            let start = 0;

            while (start < body.length) {
              const bIdx = body.indexOf(boundary, start);
              if (bIdx === -1) break;
              const partStart = bIdx + boundary.length + 2; // skip \r\n
              const nextB = body.indexOf(boundary, partStart);
              if (nextB === -1) break;
              const partEnd = nextB - 2; // remove trailing \r\n
              const part = body.slice(partStart, partEnd);

              // Split headers from body
              const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
              if (headerEnd === -1) { start = nextB; continue; }
              const headers = part.slice(0, headerEnd).toString();
              const data    = part.slice(headerEnd + 4);

              const nameMatch = headers.match(/name="([^"]+)"/);
              const fileMatch = headers.match(/filename="([^"]+)"/);
              if (nameMatch && fileMatch) {
                parts.push({ fieldname: nameMatch[1], filename: fileMatch[1], data });
              }
              start = nextB;
            }
            resolve(parts);
          });
          req.on("error", reject);
        });

      // -- Middleware router --
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";

        // ── GET /api/images ───────────────────────────────────────
        if (req.method === "GET" && url === "/api/images") {
          try {
            const files = fs.readdirSync(IMAGES_DIR).filter((f) =>
              /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f)
            );
            const list = files.map((f) => {
              const stat = fs.statSync(path.join(IMAGES_DIR, f));
              return { name: f, size: stat.size, url: `/src/assets/images/${f}` };
            });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(list));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── POST /api/upload ──────────────────────────────────────
        if (req.method === "POST" && url === "/api/upload") {
          try {
            const parts = await parseMultipart(req);
            if (!parts.length) throw new Error("No file received");
            const { filename, data } = parts[0];
            // Sanitize filename
            const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
            const dest = path.join(IMAGES_DIR, safe);
            fs.writeFileSync(dest, data);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ name: safe, url: `/src/assets/images/${safe}` }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── DELETE /api/images/:name ──────────────────────────────
        if (req.method === "DELETE" && url.startsWith("/api/images/")) {
          try {
            const filename = decodeURIComponent(url.replace("/api/images/", ""));
            const safe     = path.basename(filename); // prevent dir traversal
            const target   = path.join(IMAGES_DIR, safe);
            if (fs.existsSync(target)) fs.unlinkSync(target);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // ── GET /api/content ──────────────────────────────────────
        if (req.method === "GET" && url === "/api/content") {
          const contentPath = path.join(__dirname, "content.json");
          if (fs.existsSync(contentPath)) {
            res.setHeader("Content-Type", "application/json");
            res.end(fs.readFileSync(contentPath));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Not found" }));
          }
          return;
        }

        // ── POST /api/content ─────────────────────────────────────
        if (req.method === "POST" && url === "/api/content") {
          try {
            const chunks = [];
            req.on("data", (c) => chunks.push(c));
            req.on("end", () => {
              const body = Buffer.concat(chunks).toString();
              fs.writeFileSync(path.join(__dirname, "content.json"), body);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            });
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), cmsAssetsPlugin()],
  server: {
    historyApiFallback: true,
  },
});
