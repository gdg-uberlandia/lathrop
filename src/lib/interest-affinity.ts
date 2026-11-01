import {
  analyticsIds,
  analyticsText,
  type DashboardContext,
} from "./dashboard-context";
import { analyticsInterests, interestLabel } from "./analytics-interests";
export function buildInterestAffinity(c: DashboardContext) {
  const declared = c.profiles
      .map((p) => ({ id: p.id, interests: analyticsInterests(p) }))
      .filter((p) => p.interests.length),
    allInterests = [...new Set(declared.flatMap((p) => p.interests))];
  const kinds = [
    "mission",
    "company",
    "tag",
    "connection",
    "rating",
    "redemption",
  ] as const;
  const people: Record<string, Set<string>> = Object.fromEntries(
    kinds.map((k) => [k, new Set<string>()]),
  );
  for (const r of c.completions)
    people[analyticsText(r.activityType)]?.add(analyticsText(r.participantId));
  for (const r of c.ratings) people.rating.add(analyticsText(r.participantId));
  for (const r of c.connections)
    for (const id of analyticsIds(r.participantIds))
      if (c.allowed.has(id)) people.connection.add(id);
  for (const r of c.transactions)
    if (r.type === "reward_redemption")
      people.redemption.add(analyticsText(r.participantId));
  const companies = c
    .rows("companies")
    .map((company) => ({
      id: company.id,
      name: analyticsText(company.name) || company.id,
      people: new Set(
        c.completions
          .filter(
            (r) => r.activityType === "company" && r.activityId === company.id,
          )
          .map((r) => analyticsText(r.participantId)),
      ),
    }));
  const interests = allInterests
    .map((id) => {
      const members = declared
          .filter((p) => p.interests.includes(id))
          .map((p) => p.id),
        others = declared
          .filter((p) => !p.interests.includes(id))
          .map((p) => p.id);
      const measure = (set: Set<string>) => {
        const engaged = members.filter((p) => set.has(p)).length,
          comparison = others.filter((p) => set.has(p)).length,
          rate = members.length ? (engaged / members.length) * 100 : 0,
          comparisonRate = others.length
            ? (comparison / others.length) * 100
            : null;
        return {
          engaged,
          rate,
          comparison,
          comparisonRate,
          difference: comparisonRate === null ? null : rate - comparisonRate,
          lift: comparisonRate ? rate / comparisonRate : null,
        };
      };
      return {
        id,
        label: interestLabel(id),
        people: members.length,
        comparisonPeople: others.length,
        actions: kinds.map((kind) => ({ kind, ...measure(people[kind]) })),
        companies: companies
          .map((company) => ({
            id: company.id,
            name: company.name,
            ...measure(company.people),
          }))
          .sort(
            (a, b) =>
              (b.difference ?? -Infinity) - (a.difference ?? -Infinity) ||
              b.engaged - a.engaged,
          ),
      };
    })
    .sort(
      (a, b) => b.people - a.people || a.label.localeCompare(b.label, "pt-BR"),
    );
  return {
    base: c.profiles.length,
    declared: declared.length,
    missing: c.profiles.length - declared.length,
    interests,
  };
}
export type InterestAffinity = ReturnType<typeof buildInterestAffinity>;
