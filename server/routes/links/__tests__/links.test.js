import request from "supertest";
import { describe, expect, test, vi } from "vitest";
import { serve } from "../../../__tests__/serve";

describe("api links routes", async () => {
  // this is only used to grab app wide constants
  const { app } = await serve(process.cwd(), false);

  test("POST /api/links returns 200", async () => {
    const response = await request(app).post("/api/links").send();

    expect(response.status).toBe(200);
  });

  test("GET /api/links returns 200", async () => {
    const response = await request(app).get("/api/links").send();

    expect(response.status).toBe(200);
  });

  test("GET /api/links/:id returns 200", async () => {
    const response = await request(app).get("/api/links/123").send();

    expect(response.status).toBe(200);
  });

  test("PUT /api/links/:id returns 200", async () => {
    const response = await request(app).put("/api/links/123").send();

    expect(response.status).toBe(200);
  });

  test("DELETE /api/links/:id returns 200", async () => {
    const response = await request(app).delete("/api/links/123").send();

    expect(response.status).toBe(200);
  });
});
