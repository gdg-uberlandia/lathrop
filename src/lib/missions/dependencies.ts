import type { Mission, MissionInput } from "@/models/mission";

export function validateMissionDependencies(
  candidate: MissionInput,
  missions: Array<Pick<Mission, "id" | "prerequisites">>,
  companyIds?: Iterable<string>,
) {
  const graph = new Map(
    missions.map((mission) => [
      mission.id,
      mission.prerequisites
        .filter((item) => item.type === "mission")
        .map((item) => item.activityId),
    ]),
  );
  const dependencies = candidate.prerequisites
    .filter((item) => item.type === "mission")
    .map((item) => item.activityId);
  graph.set(candidate.id, dependencies);
  const availableCompanies = companyIds ? new Set(companyIds) : null;
  if (availableCompanies) {
    for (const prerequisite of candidate.prerequisites) {
      if (
        prerequisite.type === "company" &&
        !availableCompanies.has(prerequisite.activityId)
      ) {
        throw new Error(
          `Company pré-requisito ${prerequisite.activityId} não encontrada.`,
        );
      }
    }
  }
  for (const dependency of dependencies) {
    if (!graph.has(dependency)) {
      throw new Error(`Missão pré-requisito ${dependency} não encontrada.`);
    }
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const dependency of graph.get(id) ?? []) {
      if (visit(dependency)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  if (visit(candidate.id)) {
    throw new Error("As dependências de missões não podem formar um ciclo.");
  }
}
