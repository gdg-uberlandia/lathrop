import {
  analyticsIds,
  analyticsText,
  type DashboardContext,
} from "./dashboard-context";
import { analyticsInterests } from "./analytics-interests";
export function buildConnectionNetwork(c: DashboardContext, focusId = "") {
  const adjacent = new Map(c.profiles.map((p) => [p.id, new Set<string>()])),
    pairs = new Set<string>(),
    edges: { source: string; target: string }[] = [];
  let externalEdges = 0;
  for (const r of c.connections) {
    const pair = analyticsIds(r.participantIds).sort();
    if (pair.length !== 2) continue;
    const [a, b] = pair,
      key = JSON.stringify(pair);
    if (pairs.has(key)) continue;
    pairs.add(key);
    if (!c.allowed.has(a) || !c.allowed.has(b)) {
      externalEdges++;
      continue;
    }
    adjacent.get(a)!.add(b);
    adjacent.get(b)!.add(a);
    edges.push({ source: a, target: b });
  }
  const component = new Map<string, number>(),
    sizes: number[] = [];
  for (const p of c.profiles) {
    if (component.has(p.id)) continue;
    const index = sizes.length,
      queue = [p.id];
    component.set(p.id, index);
    let size = 0;
    while (queue.length) {
      const id = queue.pop()!;
      size++;
      for (const next of adjacent.get(id) ?? [])
        if (!component.has(next)) {
          component.set(next, index);
          queue.push(next);
        }
    }
    sizes.push(size);
  }
  const interests = new Map(
    c.profiles.map((p) => [p.id, analyticsInterests(p)]),
  );
  let comparableEdges = 0,
    crossInterestEdges = 0;
  for (const e of edges) {
    const a = interests.get(e.source)!,
      b = interests.get(e.target)!;
    if (a.length && b.length) {
      comparableEdges++;
      if (!a.some((id) => b.includes(id))) crossInterestEdges++;
    }
  }
  const nodes = c.profiles
    .map((p) => ({
      id: p.id,
      name: analyticsText(p.displayName) || "Sem nome",
      degree: adjacent.get(p.id)!.size,
      component: component.get(p.id)!,
    }))
    .sort((a, b) => b.degree - a.degree || a.id.localeCompare(b.id));
  const focus = nodes.find((n) => n.id === focusId),
    selected = focus
      ? [
          focus,
          ...nodes.filter((n) => adjacent.get(focus.id)!.has(n.id)),
        ].slice(0, 60)
      : nodes.slice(0, 60),
    sample = new Set(selected.map((n) => n.id));
  const visible = edges.filter(
    (e) => sample.has(e.source) && sample.has(e.target),
  );
  const connected = nodes.filter((n) => n.degree > 0).length;
  return {
    base: nodes.length,
    edges: edges.length,
    connected,
    isolated: nodes.length - connected,
    components: sizes.filter((n) => n > 1).length,
    largestComponent: Math.max(0, ...sizes),
    averageDegree: nodes.length ? (edges.length * 2) / nodes.length : 0,
    density:
      nodes.length > 1
        ? (edges.length / ((nodes.length * (nodes.length - 1)) / 2)) * 100
        : 0,
    externalEdges,
    comparableEdges,
    crossInterestEdges,
    leaders: nodes.slice(0, 30),
    graph: {
      focusId: focus?.id ?? null,
      nodes: selected,
      edges: visible.slice(0, 300),
      totalNodes: focus ? focus.degree + 1 : nodes.length,
      totalEdges: visible.length,
    },
  };
}
export type ConnectionNetwork = ReturnType<typeof buildConnectionNetwork>;
