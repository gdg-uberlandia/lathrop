export function isCompanyReferenced(
  missions: Array<{
    prerequisites?: Array<{ type?: string; activityId?: string }>;
  }>,
  companyId: string,
) {
  return missions.some((mission) =>
    (mission.prerequisites ?? []).some(
      (item) => item.type === "company" && item.activityId === companyId,
    ),
  );
}
