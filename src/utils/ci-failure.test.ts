import { describe, expect, it } from "vitest";

describe("CI/CD failure demonstration", () => {
    it("should fail intentionally", () => {
        expect(1 + 1).toBe(3);
    });
});
