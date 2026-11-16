import { describe, expect, it } from "vitest";
import { http, HttpResponse, delay } from "msw";
import { getResource, apiUrl, ApiError } from "../src/services/api.js";
import { server } from "./setup.js";

describe("Contrato REST y manejo de respuestas", () => {
  it("obtiene categorías desde REST", async () => {
    const data = await getResource("categories");
    expect(data).toHaveLength(6);
    expect(data.map((item) => item.name)).toContain("Ciencia ficción");
  });
  it("obtiene únicamente los libros de la categoría solicitada", async () => {
    const books = await getResource("books?category=ficcion");
    expect(books).toHaveLength(3);
    expect(books.every((item) => item.categoryId === "ficcion")).toBe(true);
  });
  it("distingue la categoría vacía de una categoría inexistente", async () => {
    expect(await getResource("books?category=drama")).toEqual([]);
    await expect(
      getResource("books?category=inexistente"),
    ).rejects.toMatchObject({ status: 404 });
  });
  it("consulta detalle y devuelve 404 para libros desconocidos", async () => {
    expect(
      await getResource("books/frankenstein", { shape: "object" }),
    ).toMatchObject({ title: "Frankenstein" });
    await expect(
      getResource("books/inexistente", { shape: "object" }),
    ).rejects.toMatchObject({ status: 404 });
  });
  it.each(["404", "500"])("explica la respuesta HTTP %s", async (scenario) => {
    await expect(getResource("books", { scenario })).rejects.toMatchObject({
      status: Number(scenario),
      message: expect.stringContaining(scenario),
    });
  });
  it("convierte un fallo de conexión en un mensaje recuperable", async () => {
    await expect(
      getResource("categories", { scenario: "network" }),
    ).rejects.toThrow("Revisa tu conexión");
  });
  it("no confunde JSON inválido con un catálogo vacío", async () => {
    server.use(http.get("*/api/books", () => new HttpResponse("no es json")));
    await expect(getResource("books")).rejects.toThrow(
      "respuesta del servicio no es válida",
    );
  });
  it("rechaza registros incompletos", async () => {
    server.use(
      http.get("*/api/books", () => HttpResponse.json([{ id: "roto" }])),
    );
    await expect(getResource("books")).rejects.toBeInstanceOf(ApiError);
  });
  it("propaga la cancelación al cambiar de consulta", async () => {
    server.use(
      http.get("*/api/books", async () => {
        await delay(100);
        return HttpResponse.json([]);
      }),
    );
    const controller = new AbortController();
    const request = getResource("books", { signal: controller.signal });
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: "AbortError" });
  });
  it("mantiene categoría y escenario como parámetros separados", () => {
    const url = apiUrl("books?category=ciencia-ficcion", "500");
    expect(url.searchParams.get("category")).toBe("ciencia-ficcion");
    expect(url.searchParams.get("scenario")).toBe("500");
  });
});
