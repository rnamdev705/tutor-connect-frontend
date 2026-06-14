import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../tutorConnect-api/openapi.json",
  output: {
    clean: false,
    path: "src/api",
  },
  plugins: [
    "@hey-api/typescript",
    "@hey-api/sdk",
    {
      name: "@tanstack/react-query",
      queryOptions: true,
      mutationOptions: true,
    },
  ],
});
