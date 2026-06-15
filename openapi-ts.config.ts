import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../tutorConnect-api/openapi.json",
  output: {
    clean: false,
    path: "src/api",
  },
  plugins: [
    "@hey-api/typescript",
    {
      name: "@hey-api/client-fetch",
      runtimeConfigPath: "./src/api/create-client-config",
    },
    {
      name: "@hey-api/sdk",
      client: "@hey-api/client-fetch",
    },
    {
      name: "@tanstack/react-query",
      queryOptions: true,
      mutationOptions: true,
    },
  ],
});
