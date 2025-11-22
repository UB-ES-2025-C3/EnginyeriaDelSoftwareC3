import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://witty-bay-0f8f41603.3.azurestaticapps.net/", // o el puerto que uses para el front
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
  },
});
