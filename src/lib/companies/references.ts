export function isCompanyReferenced(
  missions: Array<{
    companyId?: string | null;
    prerequisites?: Array<{ type?: string; activityId?: string }>;
  }>,
  companyId: string,
) {
  return missions.some(
    (mission) =>
      mission.companyId === companyId ||
      (mission.prerequisites ?? []).some(
        (item) => item.type === "company" && item.activityId === companyId,
      ),
  );
}
