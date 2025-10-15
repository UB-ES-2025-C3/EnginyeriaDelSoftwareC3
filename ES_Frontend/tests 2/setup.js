import { config } from "@vue/test-utils";
import { vi } from "vitest";

// Simula el mòdul axios per evitar crides reals a l'API
vi.mock("axios", () => ({
    default: {
        post: vi.fn(),
    },
}));

// Configura Vue Test Utils
config.global.mocks = {
    $t: (msg) => msg, // Simula i18n si l'utilitzes
};

// Afegeix matchers de jest-dom
import "@testing-library/jest-dom";
