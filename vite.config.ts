import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";

async function readJson(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function send(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
}

function securityPlugin(pin: string, homeAssistantUrl: string, token: string): Plugin {
  return {
    name: "kitchenos-security",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.method !== "POST") return next();

        if (request.url === "/security/verify") {
          try {
            const body = await readJson(request);
            return body.pin === pin
              ? send(response, 200, { ok: true })
              : send(response, 401, { error: "Incorrect PIN" });
          } catch {
            return send(response, 400, { error: "Invalid request" });
          }
        }

        if (request.url === "/security/ha-action") {
          try {
            const body = await readJson(request);
            if (body.pin !== pin) return send(response, 401, { error: "Incorrect PIN" });
            const allowed = body.domain === "lock" && body.service === "unlock";
            if (!allowed) return send(response, 403, { error: "Action not allowed" });

            const haResponse = await fetch(`${homeAssistantUrl}/api/services/${body.domain}/${body.service}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body.data ?? {}),
            });
            const text = await haResponse.text();
            response.statusCode = haResponse.status;
            response.setHeader("Content-Type", haResponse.headers.get("content-type") ?? "application/json");
            response.end(text);
            return;
          } catch {
            return send(response, 400, { error: "Invalid request" });
          }
        }

        return next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const homeAssistantUrl = env.HA_URL?.replace(/\/$/, "");
  const homeAssistantToken = env.HA_TOKEN;
  const securityPin = env.KITCHENOS_SECURITY_PIN;

  if (!homeAssistantUrl) throw new Error("HA_URL is missing from .env.local");
  if (!homeAssistantToken) throw new Error("HA_TOKEN is missing from .env.local");
  if (!securityPin || !/^\d{4}$/.test(securityPin)) {
    throw new Error("KITCHENOS_SECURITY_PIN must be a 4-digit PIN in .env.local");
  }

  return {
    plugins: [react(), securityPlugin(securityPin, homeAssistantUrl, homeAssistantToken)],
    server: {
      proxy: {
        "/ha-api": {
          target: homeAssistantUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/ha-api/, "/api"),
          configure(proxy) {
            proxy.on("proxyReq", (proxyRequest) => {
              proxyRequest.setHeader("Authorization", `Bearer ${homeAssistantToken}`);
              proxyRequest.setHeader("Content-Type", "application/json");
            });
          },
        },
      },
    },
  };
});
