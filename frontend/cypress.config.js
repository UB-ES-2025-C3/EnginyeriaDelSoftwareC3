import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://calm-forest-0e7ca3203.3.azurestaticapps.net/", // o el puerto que uses para el front
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
  },
});
