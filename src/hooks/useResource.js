import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getResource } from "../services/api.js";

const scenarios = new Set(["normal", "404", "500", "network", "slow", "empty"]);

export function useResource(
  path,
  { shape = "list", interactive = false } = {},
) {
  const client = useQueryClient();
  const [params, setParams] = useSearchParams();
  const requestedScenario = params.get("scenario");
  const scenario =
    interactive &&
    scenarios.has(requestedScenario) &&
    !(shape === "object" && requestedScenario === "empty")
      ? requestedScenario
      : "normal";
  const query = useQuery({
    queryKey: [path, scenario],
    queryFn: ({ signal }) => getResource(path, { signal, scenario, shape }),
    // Los escenarios de prueba siempre pasan por la red para poder observar la petición.
    staleTime: scenario === "normal" ? 5 * 60 * 1000 : 0,
  });
  const cached = client.getQueryData([path, "normal"]);
  const data = query.data ?? (query.isError ? cached : undefined);

  function changeScenario(next) {
    if (next === scenario) {
      query.refetch();
      return;
    }
    // Reintentar o simular fuerza una consulta nueva, incluso si hay una copia en caché.
    client.invalidateQueries({
      queryKey: [path, next],
      exact: true,
      refetchType: "none",
    });
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        if (next === "normal") updated.delete("scenario");
        else updated.set("scenario", next);
        return updated;
      },
      { replace: true },
    );
  }

  return {
    ...query,
    data,
    scenario,
    hasFallback: query.isError && data !== undefined,
    changeScenario,
    retry: () => (interactive ? changeScenario("normal") : query.refetch()),
  };
}
