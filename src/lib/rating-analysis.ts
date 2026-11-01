import {
  analyticsText,
  analyticsNumber,
  type DashboardContext,
} from "./dashboard-context";
export const ratingDimensions = [
  "speakerRating",
  "contentRating",
  "comprehensionRating",
] as const;
export function buildRatingAnalysis(c: DashboardContext) {
  const talks = c
    .rows("talks")
    .map((t) => {
      const rows = c.ratings.filter((r) => r.talkId === t.id);
      const dimensions = Object.fromEntries(
        ratingDimensions.map((key) => {
          const values = rows
              .map((r) => analyticsNumber(r[key]))
              .filter((v) => Number.isInteger(v) && v >= 1 && v <= 5)
              .sort((a, b) => a - b),
            mean = values.length
              ? values.reduce((s, n) => s + n, 0) / values.length
              : null;
          return [
            key,
            {
              count: values.length,
              mean,
              median: values.length
                ? (values[Math.floor((values.length - 1) / 2)] +
                    values[Math.floor(values.length / 2)]) /
                  2
                : null,
              distribution: [1, 2, 3, 4, 5].map((score) => ({
                score,
                count: values.filter((v) => v === score).length,
              })),
              deviation:
                mean === null
                  ? null
                  : Math.sqrt(
                      values.reduce((s, v) => s + (v - mean) ** 2, 0) /
                        values.length,
                    ),
            },
          ];
        }),
      ) as Record<
        (typeof ratingDimensions)[number],
        {
          count: number;
          mean: number | null;
          median: number | null;
          distribution: { score: number; count: number }[];
          deviation: number | null;
        }
      >;
      return {
        id: t.id,
        title: analyticsText(t.title) || t.id,
        count: rows.length,
        reviewers: new Set(rows.map((r) => r.participantId)).size,
        dimensions,
      };
    })
    .sort((a, b) => b.reviewers - a.reviewers);
  return {
    talks,
    reviewers: new Set(c.ratings.map((r) => r.participantId)).size,
    ratings: c.ratings.length,
  };
}
export type RatingAnalysis = ReturnType<typeof buildRatingAnalysis>;
