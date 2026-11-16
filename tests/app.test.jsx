import React from "react";
import { describe, expect, it } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { http, HttpResponse, delay } from "msw";
import App from "../src/App.jsx";
import { createQueryClient } from "../src/services/queryClient.js";
import { server } from "./setup.js";
import { categories as mockCategories } from "../src/mocks/data.js";

function renderApp(route = "/catalogo") {
  const client = createQueryClient();
  // Evita temporizadores de recolección después de cada prueba.
  client.setDefaultOptions({
    queries: { ...client.getDefaultOptions().queries, gcTime: Infinity },
  });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  return client;
}

describe("Navegación y estados de las consultas", () => {
  it("permite salir de una carga lenta y cancela la petición anterior", async () => {
    let slowStarted = false;
    let slowAborted = false;
    server.use(
      http.get("*/api/categories", async ({ request }) => {
        if (new URL(request.url).searchParams.get("scenario") === "slow") {
          slowStarted = true;
          request.signal.addEventListener("abort", () => {
            slowAborted = true;
          });
          await delay(120);
          return HttpResponse.json([]);
        }
        return HttpResponse.json(mockCategories);
      }),
    );
    renderApp("/categorias");
    await screen.findByRole("heading", { name: "Ficción", exact: true });
    const select = screen.getByLabelText("Respuesta de la API");
    fireEvent.change(select, { target: { value: "slow" } });
    await waitFor(() => expect(slowStarted).toBe(true));
    expect(select.disabled).toBe(false);
    expect(screen.getByText("Cargando las categorías…")).toBeTruthy();
    fireEvent.change(select, { target: { value: "normal" } });
    await waitFor(() => expect(slowAborted).toBe(true));
    await screen.findByRole("heading", { name: "Ficción", exact: true });
    await delay(150);
    expect(screen.queryByText("No hay categorías disponibles")).toBeNull();
    expect(select.value).toBe("normal");
  });
  it("aplica listas vacías y errores repetidos y recupera la respuesta normal", async () => {
    renderApp("/categorias");
    await screen.findByRole("heading", { name: "Ficción", exact: true });
    const select = screen.getByLabelText("Respuesta de la API");
    fireEvent.change(select, { target: { value: "empty" } });
    await screen.findByRole("heading", {
      name: "No hay categorías disponibles",
    });
    fireEvent.change(select, { target: { value: "normal" } });
    await screen.findByRole("heading", { name: "Ficción", exact: true });
    for (const scenario of ["500", "404", "500", "network"]) {
      fireEvent.change(select, { target: { value: scenario } });
      await waitFor(() =>
        expect(screen.getByRole("alert").textContent).toContain(
          scenario === "network" ? "Revisa tu conexión" : scenario,
        ),
      );
      expect(select.value).toBe(scenario);
    }
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
    expect(select.value).toBe("normal");
    await screen.findByRole("heading", { name: "Ficción", exact: true });
  });
  it("descarta un estado de lista vacía en la URL de un detalle individual", async () => {
    renderApp("/libros/frankenstein?scenario=empty");
    await screen.findByRole("heading", { name: "Frankenstein", level: 1 });
    const select = screen.getByLabelText("Respuesta de la API");
    expect(select.value).toBe("normal");
    expect([...select.options].some((option) => option.value === "empty")).toBe(
      false,
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });
  it("busca títulos y autores ignorando tildes y permite limpiar los resultados vacíos", async () => {
    renderApp();
    await screen.findByRole("link", { name: "Desolación", exact: true });
    const search = screen.getByRole("searchbox", {
      name: "Buscar en el catálogo",
    });
    fireEvent.change(search, { target: { value: "desolacion" } });
    expect(
      screen.getByRole("link", { name: "Desolación", exact: true }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: "Frankenstein", exact: true }),
    ).toBeNull();
    fireEvent.change(search, { target: { value: "GABRIELA" } });
    expect(
      screen.getByRole("link", { name: "Desolación", exact: true }),
    ).toBeTruthy();
    fireEvent.change(search, { target: { value: "inexistente" } });
    expect(
      screen.getByRole("heading", { name: "No encontramos ese libro" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Limpiar búsqueda" }));
    expect(
      screen.getByRole("link", { name: "Frankenstein", exact: true }),
    ).toBeTruthy();
  });
  it("ordena por precio sin mutar el catálogo guardado en caché", async () => {
    const client = renderApp();
    await screen.findByRole("link", {
      name: "Orgullo y prejuicio",
      exact: true,
    });
    fireEvent.change(screen.getByLabelText("Ordenar"), {
      target: { value: "price-asc" },
    });
    const first = screen.getAllByRole("article")[0];
    expect(
      within(first).getByRole("link", {
        name: "La máquina del tiempo",
        exact: true,
      }),
    ).toBeTruthy();
    expect(client.getQueryData(["books", "normal"])[0].id).toBe(
      "orgullo-y-prejuicio",
    );
  });
  it("navega desde el buscador de la cabecera al resultado del autor", async () => {
    renderApp("/");
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Título o autor" }),
      { target: { value: "Gabriela Mistral" } },
    );
    fireEvent.submit(screen.getByRole("search", { name: "Buscar libros" }));
    expect(
      await screen.findByRole("heading", {
        name: "Todos los libros",
        level: 1,
      }),
    ).toBeTruthy();
    expect(
      await screen.findByRole("link", { name: "Desolación", exact: true }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: "Frankenstein", exact: true }),
    ).toBeNull();
  });
  it("abre el detalle completo desde la tarjeta de un libro", async () => {
    renderApp("/catalogo");
    fireEvent.click(
      await screen.findByRole("link", { name: "Frankenstein", exact: true }),
    );
    expect(
      await screen.findByRole("heading", { name: "Frankenstein", level: 1 }),
    ).toBeTruthy();
    expect(screen.getByText("Publicación original")).toBeTruthy();
    expect(screen.getByText("1818")).toBeTruthy();
    expect(screen.getByText("280")).toBeTruthy();
  });
  it("muestra carga y luego libros obtenidos desde la API", async () => {
    server.use(
      http.get("*/api/books", async () => {
        await delay(80);
        return HttpResponse.json([]);
      }),
    );
    renderApp();
    expect(screen.getByText("Cargando los libros…")).toBeTruthy();
    expect(
      await screen.findByText("No hay libros en esta categoría"),
    ).toBeTruthy();
    expect(screen.queryByText("Cargando los libros…")).toBeNull();
  });
  it("consulta categorías por REST y navega al filtro", async () => {
    renderApp("/categorias");
    fireEvent.click(
      await screen.findByRole("link", {
        name: /Ciencia ficción.*Explorar libros/,
      }),
    );
    expect(
      await screen.findByRole("heading", { name: "Ciencia ficción" }),
    ).toBeTruthy();
    expect(
      await screen.findByRole("link", { name: "Frankenstein" }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: "Orgullo y prejuicio" }),
    ).toBeNull();
  });
  it("conserva los resultados de la misma consulta al fallar y permite recuperar", async () => {
    renderApp();
    await screen.findByRole("link", { name: "Orgullo y prejuicio" });
    fireEvent.change(screen.getByLabelText("Respuesta de la API"), {
      target: { value: "500" },
    });
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByText(/última versión consultada/)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Orgullo y prejuicio" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
    expect(
      await screen.findByRole("link", { name: "Orgullo y prejuicio" }),
    ).toBeTruthy();
  });
  it("reintenta un primer acceso fallido sin inventar datos", async () => {
    renderApp("/categorias?scenario=404");
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByText(/última versión consultada/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(
      await screen.findByRole("heading", { name: "Ficción" }),
    ).toBeTruthy();
  });
  it("muestra estado vacío y ofrece una ruta alternativa", async () => {
    renderApp("/categorias/drama");
    expect(
      await screen.findByText("No hay libros en esta categoría"),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Ver todos los libros" }));
    expect(
      await screen.findByRole("link", { name: "Orgullo y prejuicio" }),
    ).toBeTruthy();
  });
  it("reutiliza consultas frescas al regresar y solo refresca por petición explícita", async () => {
    let requests = 0;
    server.events.on("request:start", ({ request }) => {
      if (new URL(request.url).pathname.endsWith("/api/categories")) requests++;
    });
    renderApp("/categorias");
    const categoryLink = await screen.findByRole("link", {
      name: /Ciencia ficción.*Explorar libros/,
    });
    expect(requests).toBe(1);
    fireEvent.click(categoryLink);
    await screen.findByRole("link", { name: "Frankenstein" });
    fireEvent.click(
      within(
        screen.getByRole("navigation", { name: "Navegación principal" }),
      ).getByRole("link", { name: "Categorías" }),
    );
    await screen.findByRole("heading", { name: "Ciencia ficción" });
    expect(requests).toBe(1);
    fireEvent.click(
      screen.getByRole("button", { name: "Actualizar consulta" }),
    );
    await waitFor(() => expect(requests).toBe(2));
    server.events.removeAllListeners("request:start");
  });
  it("no reutiliza libros de otra categoría como respaldo", async () => {
    const client = renderApp("/categorias/drama?scenario=500");
    client.setQueryData(
      ["books?category=ficcion", "normal"],
      [{ id: "otro", title: "Otro libro" }],
    );
    await screen.findByRole("alert");
    expect(screen.queryByText(/última versión consultada/)).toBeNull();
    expect(screen.queryByText("Otro libro")).toBeNull();
  });
  it("muestra una salida para un libro y una ruta inexistentes", async () => {
    renderApp("/libros/no-existe");
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Libro no disponible" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Volver al catálogo" }),
    ).toBeTruthy();
  });
  it("resuelve rutas desconocidas con una página de ayuda", () => {
    renderApp("/ruta-desconocida");
    expect(
      screen.getByRole("heading", { name: "Página no encontrada" }),
    ).toBeTruthy();
  });
});
