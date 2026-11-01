import assert from "node:assert/strict";
import { test } from "node:test";
import { selectDashboardContext } from "./dashboard-context";
import { buildConnectionNetwork } from "./connection-network";
test("rede deduplica pares, ignora autoconexão, separa componentes e limita o escopo ao papel", () => {
  const c = selectDashboardContext(
    {
      profiles: [
        { id: "a", accessRoles: ["participant"], interests: ["web"] },
        { id: "b", accessRoles: ["participant"], interests: ["cloud"] },
        { id: "isolated", accessRoles: ["participant"] },
        { id: "staff", accessRoles: ["admin"] },
      ],
      connections: [
        ["a", "b"],
        ["b", "a"],
        ["a", "a"],
        ["a", "staff"],
      ].map((pair, i) => ({
        id: String(i),
        participantIds: pair,
        status: "accepted",
        acceptedAt: "2026-10-31T12:00:00Z",
      })),
    },
    { role: "participant" },
  );
  const d = buildConnectionNetwork(c);
  assert.equal(d.edges, 1);
  assert.equal(d.isolated, 1);
  assert.equal(d.components, 1);
  assert.equal(d.largestComponent, 2);
  assert.equal(d.externalEdges, 1);
  assert.equal(d.crossInterestEdges, 1);
  assert.equal(buildConnectionNetwork(c, "b").graph.focusId, "b");
});

test("lista de conexões de um participante não perde vizinhos por um limite visual antigo", () => {
  const profiles = Array.from({ length: 81 }, (_, i) => ({ id: String(i) }));
  const neighbors = profiles.slice(1);
  const c = selectDashboardContext({
    profiles,
    connections: neighbors.map((p) => ({
      id: p.id,
      participantIds: ["0", p.id],
      status: "accepted",
      acceptedAt: "2026-10-31T12:00:00Z",
    })),
  });
  const d = buildConnectionNetwork(c, "0");
  assert.equal(d.graph.nodes.length, 81);
  assert.equal(d.graph.totalNodes, 81);
});
