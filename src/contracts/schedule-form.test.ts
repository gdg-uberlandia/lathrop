import assert from "node:assert/strict";
import { it } from "node:test";
import { createFormControl } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleInputSchema, type ScheduleInput } from "./schedule";

for (const type of ["opening_keynote", "closing_keynote"] as const) {
  it(`permite trocar uma atividade com título por ${type}`, async () => {
    const form = createFormControl<ScheduleInput>({
      resolver: zodResolver(scheduleInputSchema),
      defaultValues: {
        id: "schedule-test",
        startTime: "08:00",
        endTime: "09:00",
        track: null,
        activity: { type: "opening", title: "Abertura" },
        active: true,
      },
    });
    form.register("activity.title");
    form.unregister("activity.title");
    form.setValue("activity", { type, talkId: "keynote-test" });
    form.register("activity.talkId");
    let submitted = false;
    await form.handleSubmit((value) => {
      assert.deepEqual(value.activity, { type, talkId: "keynote-test" });
      submitted = true;
    })();
    assert.equal(submitted, true);
  });
}
