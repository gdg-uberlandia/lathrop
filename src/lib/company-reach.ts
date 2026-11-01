export type CompanyVisit = {
  companyId: string;
  personId: string;
  hour: string;
};
export function buildCompanyReach(
  profileIds: string[],
  catalog: { id: string; name: string }[],
  visits: CompanyVisit[],
) {
  const allowed = new Set(profileIds),
    filtered = visits.filter((v) => allowed.has(v.personId));
  const names = new Map(catalog.map((c) => [c.id, c.name]));
  for (const visit of filtered)
    if (!names.has(visit.companyId))
      names.set(visit.companyId, "Empresa indisponível");
  const peopleByCompany = new Map<string, Set<string>>();
  const companiesByPerson = new Map(
    profileIds.map((id) => [id, new Set<string>()]),
  );
  for (const visit of filtered) {
    const people = peopleByCompany.get(visit.companyId) ?? new Set<string>();
    people.add(visit.personId);
    peopleByCompany.set(visit.companyId, people);
    companiesByPerson.get(visit.personId)!.add(visit.companyId);
  }
  const companies = [...names]
    .map(([id, name]) => {
      const people = peopleByCompany.get(id) ?? new Set<string>(),
        hourly = new Map<string, Set<string>>();
      for (const visit of filtered.filter((v) => v.companyId === id)) {
        const bucket = hourly.get(visit.hour) ?? new Set<string>();
        bucket.add(visit.personId);
        hourly.set(visit.hour, bucket);
      }
      const overlaps = [...names]
        .filter(([other]) => other !== id)
        .map(([other, name]) => {
          const shared = [...people].filter((p) =>
            peopleByCompany.get(other)?.has(p),
          ).length;
          return {
            id: other,
            name,
            people: shared,
            percent: people.size ? (shared / people.size) * 100 : 0,
          };
        })
        .filter((c) => c.people > 0)
        .sort((a, b) => b.people - a.people);
      return {
        id,
        name,
        visitors: people.size,
        reach: allowed.size ? (people.size / allowed.size) * 100 : 0,
        hourly: [...hourly]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([hour, bucket]) => ({ hour, people: bucket.size })),
        overlaps,
      };
    })
    .sort(
      (a, b) =>
        b.visitors - a.visitors || a.name.localeCompare(b.name, "pt-BR"),
    );
  const coverage = [
    { label: "Nenhuma empresa", min: 0, max: 0 },
    { label: "1 empresa", min: 1, max: 1 },
    { label: "2 a 4 empresas", min: 2, max: 4 },
    { label: "5 a 9 empresas", min: 5, max: 9 },
    { label: "10 ou mais empresas", min: 10, max: Infinity },
  ].map((b) => {
    const people = [...companiesByPerson.values()].filter(
      (c) => c.size >= b.min && c.size <= b.max,
    ).length;
    return {
      label: b.label,
      people,
      percent: allowed.size ? (people / allowed.size) * 100 : 0,
    };
  });
  const reached = [...companiesByPerson.values()].filter(
    (v) => v.size > 0,
  ).length;
  return {
    base: allowed.size,
    reached,
    reach: allowed.size ? (reached / allowed.size) * 100 : 0,
    averageCompanies: allowed.size
      ? [...companiesByPerson.values()].reduce((s, c) => s + c.size, 0) /
        allowed.size
      : 0,
    companies,
    coverage,
  };
}
export type CompanyReachData = ReturnType<typeof buildCompanyReach>;
