export type TicketFlowTransaction = {
  participantId: string;
  type: string;
  referenceType: string;
  delta: number;
  date: string | null;
};
function classify(t: TicketFlowTransaction) {
  if (t.type === "onboarding_grant" && t.delta > 0)
    return { id: "onboarding", label: "Bônus de cadastro" };
  if (t.type === "xp_conversion" && t.delta > 0)
    return t.referenceType === "raffle_closure"
      ? { id: "auto-conversion", label: "Conversão automática para sorteio" }
      : { id: "conversion", label: "Conversão de XP em tickets" };
  if (t.type === "reward_redemption")
    return t.delta < 0
      ? { id: "reward", label: "Resgate de brinde" }
      : { id: "reward-return", label: "Crédito vinculado a brinde" };
  if (t.type === "adjustment" && t.referenceType === "raffle_winner")
    return t.delta < 0
      ? { id: "raffle", label: "Consumo por prêmio de sorteio" }
      : { id: "raffle-return", label: "Devolução de tickets de sorteio" };
  return { id: "other", label: "Correções e outras movimentações" };
}
function dailySeries(transactions: TicketFlowTransaction[]) {
  const buckets = new Map<string, { delta: number; transactions: number }>();
  for (const t of transactions) {
    if (!t.date) continue;
    const bucket = buckets.get(t.date) ?? { delta: 0, transactions: 0 };
    bucket.delta += t.delta;
    bucket.transactions++;
    buckets.set(t.date, bucket);
  }
  let net = 0;
  return [...buckets]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, b]) => {
      net += b.delta;
      return { date, ...b, net };
    });
}
export function buildTicketFlow(
  period: TicketFlowTransaction[],
  history: TicketFlowTransaction[],
  currentBalance: number,
) {
  const buckets = new Map<
    string,
    {
      label: string;
      direction: "in" | "out" | "neutral";
      rows: TicketFlowTransaction[];
    }
  >();
  for (const t of period) {
    const kind = classify(t),
      direction = t.delta > 0 ? "in" : t.delta < 0 ? "out" : "neutral",
      key = `${kind.id}:${direction}`;
    const bucket = buckets.get(key) ?? {
      label: kind.label,
      direction,
      rows: [],
    };
    bucket.rows.push(t);
    buckets.set(key, bucket);
  }
  const movements = [...buckets]
    .map(([id, b]) => ({
      id,
      label: b.label,
      direction: b.direction,
      amount: b.rows.reduce((s, t) => s + Math.abs(t.delta), 0),
      transactions: b.rows.length,
      people: new Set(b.rows.map((t) => t.participantId)).size,
      daily: dailySeries(b.rows),
    }))
    .sort((a, b) => b.amount - a.amount);
  const incoming = period.reduce((s, t) => s + Math.max(0, t.delta), 0),
    outgoing = period.reduce((s, t) => s + Math.max(0, -t.delta), 0),
    recordedBalance = history.reduce((s, t) => s + t.delta, 0);
  return {
    incoming,
    outgoing,
    net: incoming - outgoing,
    transactions: period.length,
    movements,
    daily: dailySeries(period),
    reconciliation: {
      currentBalance,
      recordedBalance,
      difference: currentBalance - recordedBalance,
      historyTransactions: history.length,
      undatedTransactions: history.filter((t) => !t.date).length,
    },
  };
}
export type TicketFlowData = ReturnType<typeof buildTicketFlow>;
