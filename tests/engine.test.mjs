import test from "node:test";
import assert from "node:assert/strict";

import { resolveEvent } from "../lib/engine/eventResolver.ts";
import { resolveAction } from "../lib/engine/actionResolver.ts";
import {
  applyEventEffects,
  createInitialLogs,
} from "../lib/engine/logStore.ts";
import { resolveEnding } from "../lib/engine/endingResolver.ts";
import { createEventSeed } from "../lib/engine/seed.ts";
import { events } from "../lib/data/events.ts";

const buildSeed = (overrides) =>
  createEventSeed({
    dayIndex: 1,
    playerId: "tester",
    scene: "dorm",
    intent: "sleep",
    logs: createInitialLogs(),
    ...overrides,
  }).seed;

test("resolveEvent is deterministic for the same seed", () => {
  const logs = createInitialLogs();
  const params = resolveAction("sleep", "dorm", logs);
  const seed = buildSeed();

  const first = resolveEvent("dorm", params, logs, seed);
  const second = resolveEvent("dorm", params, logs, seed);

  assert.equal(first.id, second.id);
});

test("resolveEvent uses seed to pick from ordered candidates", () => {
  const logs = createInitialLogs();
  const params = resolveAction("sleep", "dorm", logs);
  const seed = buildSeed({ dayIndex: 2 });

  const candidates = events
    .filter((event) => event.scene === "dorm")
    .sort((a, b) => a.id.localeCompare(b.id));
  const expected = candidates[seed % candidates.length];

  const picked = resolveEvent("dorm", params, logs, seed);

  assert.equal(picked.id, expected.id);
});

test("resolveEvent respects event conditions", () => {
  const logs = createInitialLogs();
  const params = resolveAction("go_out", "city", logs);
  const seed = buildSeed({ scene: "city", intent: "go_out" });

  const picked = resolveEvent("city", params, logs, seed);

  assert.notEqual(picked.id, "city_ryo_crossing");
});

test("applyEventEffects updates log values deterministically", () => {
  const logs = createInitialLogs();
  const event = events.find((entry) => entry.id === "dorm_quiet_cooking");
  assert.ok(event);

  const nextLogs = applyEventEffects(logs, event);

  assert.equal(nextLogs.humanity, logs.humanity + 2);
  assert.equal(nextLogs.cityAttachment, logs.cityAttachment + 1);
  assert.equal(nextLogs.patterns.spending, 1);
});

test("resolveEnding selects lead and ending type based on logs", () => {
  const logs = createInitialLogs();
  logs.relationshipInfiltration.ryo = 5;
  logs.cityAttachment = 8;

  const ending = resolveEnding(logs);

  assert.equal(ending.lead, "ryo");
  assert.equal(ending.endingType, "bound");
});
