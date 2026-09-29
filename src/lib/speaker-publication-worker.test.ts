import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Firestore } from "firebase-admin/firestore";
import { publishDueSpeakers } from "../../functions/src/publish-speakers";

type Data = Record<string, unknown>;
type Ref = { path: string };
const eventId = "devfest-triangulo-2026";
const now = new Date("2026-09-29T17:30:00.000Z");
const due = "2026-09-29T17:30:00.000Z";
const future = "2026-09-29T18:00:00.000Z";

// Captures the initial query separately from transaction reads, so a concurrent
// cancellation/reschedule can be injected between discovery and publication.
function memoryDatabase() {
  const data = new Map<string, Data>();
  let beforeTransaction: (() => void) | undefined;
  const snapshot = (path: string) => {
    const value = data.has(path) ? structuredClone(data.get(path)) : undefined;
    return {
      id: path.split("/").pop()!,
      ref: { path },
      exists: !!value,
      data: () => value,
    };
  };
  const db = {
    collection(name: string) {
      return {
        doc(id: string) {
          return { path: `${name}/${id}` };
        },
        where(field: string, _operator: string, value: unknown) {
          return {
            async get() {
              return {
                docs: [...data.entries()]
                  .filter(
                    ([path, doc]) =>
                      path.startsWith(`${name}/`) && doc[field] === value,
                  )
                  .map(([path]) => snapshot(path)),
              };
            },
          };
        },
      };
    },
    async runTransaction(action: (transaction: unknown) => Promise<unknown>) {
      beforeTransaction?.();
      const writes: (() => void)[] = [];
      const result = await action({
        async get(ref: Ref) {
          return snapshot(ref.path);
        },
        update(ref: Ref, fields: Data) {
          writes.push(() =>
            data.set(ref.path, { ...data.get(ref.path), ...fields }),
          );
        },
        delete(ref: Ref) {
          writes.push(() => data.delete(ref.path));
        },
      });
      writes.forEach((write) => write());
      return result;
    },
  } as unknown as Firestore;
  return {
    db,
    data,
    beforeTransaction(action?: () => void) {
      beforeTransaction = action;
    },
    add(id: string, publishAt = due, prefix = "", event = eventId) {
      data.set(`${prefix}speakers/${id}`, {
        eventId: event,
        name: id,
        isVisible: false,
      });
      data.set(`${prefix}speakerPublications/${id}`, {
        eventId: event,
        speakerId: id,
        publishAt,
      });
    },
  };
}

describe("rotina de publicação", () => {
  it("publica no horário e recupera atrasados sem antecipar futuros ou outros eventos", async () => {
    const store = memoryDatabase();
    store.add("due");
    store.add("late", "2026-09-29T17:00:00.000Z");
    store.add("future", future);
    store.add("other", due, "", "another-event");
    assert.deepEqual(await publishDueSpeakers(store.db, { eventId, now }), {
      published: 2,
    });
    assert.equal(store.data.get("speakers/due")?.isVisible, true);
    assert.equal(store.data.get("speakers/late")?.isVisible, true);
    assert.equal(store.data.get("speakers/future")?.isVisible, false);
    assert.equal(store.data.get("speakers/other")?.isVisible, false);
    assert.equal(store.data.has("speakerPublications/due"), false);
  });
  it("não republica nem altera updatedAt quando executada novamente", async () => {
    const store = memoryDatabase();
    store.add("one");
    await publishDueSpeakers(store.db, { eventId, now });
    assert.deepEqual(
      await publishDueSpeakers(store.db, {
        eventId,
        now: new Date(now.getTime() + 60_000),
      }),
      { published: 0 },
    );
    assert.deepEqual(store.data.get("speakers/one")?.updatedAt, now);
  });
  it("respeita cancelamento entre a consulta e a transação", async () => {
    const store = memoryDatabase();
    store.add("one");
    store.beforeTransaction(() => {
      store.data.delete("speakerPublications/one");
    });
    assert.deepEqual(await publishDueSpeakers(store.db, { eventId, now }), {
      published: 0,
    });
    assert.equal(store.data.get("speakers/one")?.isVisible, false);
  });
  it("respeita reagendamento entre a consulta e a transação", async () => {
    const store = memoryDatabase();
    store.add("one");
    store.beforeTransaction(() => {
      store.data.get("speakerPublications/one")!.publishAt = future;
    });
    assert.deepEqual(await publishDueSpeakers(store.db, { eventId, now }), {
      published: 0,
    });
    assert.equal(store.data.get("speakers/one")?.isVisible, false);
    assert.equal(store.data.get("speakerPublications/one")?.publishAt, future);
  });
  it("limpa pendências de palestrantes excluídos ou publicados manualmente", async () => {
    const store = memoryDatabase();
    store.add("deleted");
    store.add("visible");
    store.data.delete("speakers/deleted");
    store.data.get("speakers/visible")!.isVisible = true;
    assert.deepEqual(await publishDueSpeakers(store.db, { eventId, now }), {
      published: 0,
    });
    assert.equal(store.data.has("speakerPublications/deleted"), false);
    assert.equal(store.data.has("speakerPublications/visible"), false);
  });
  it("não publica um ID reaproveitado em outro evento", async () => {
    const store = memoryDatabase();
    store.add("one");
    store.data.get("speakers/one")!.eventId = "another-event";
    assert.deepEqual(await publishDueSpeakers(store.db, { eventId, now }), {
      published: 0,
    });
    assert.equal(store.data.get("speakers/one")?.isVisible, false);
  });
  it("isola coleções de teste das coleções reais", async () => {
    const store = memoryDatabase();
    store.add("one");
    store.add("one", due, "test_");
    assert.deepEqual(
      await publishDueSpeakers(store.db, {
        eventId,
        now,
        collectionPrefix: "test_",
      }),
      { published: 1 },
    );
    assert.equal(store.data.get("speakers/one")?.isVisible, false);
    assert.equal(store.data.get("test_speakers/one")?.isVisible, true);
  });
  it("mantém o agendamento quando ocorre falha e permite recuperação", async () => {
    const store = memoryDatabase();
    store.add("one");
    store.beforeTransaction(() => {
      throw new Error("temporarily unavailable");
    });
    await assert.rejects(publishDueSpeakers(store.db, { eventId, now }));
    assert.equal(store.data.get("speakers/one")?.isVisible, false);
    assert.equal(store.data.has("speakerPublications/one"), true);
    store.beforeTransaction();
    assert.deepEqual(await publishDueSpeakers(store.db, { eventId, now }), {
      published: 1,
    });
  });
});
