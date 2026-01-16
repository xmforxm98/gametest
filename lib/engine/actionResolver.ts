import type { ActionIntent, ActionParams, LogState, SceneId } from "@/types/game";

const deriveTime = (intent: ActionIntent, logs: LogState): ActionParams["time"] => {
  if (intent === "sleep") {
    return "night";
  }

  if (logs.patterns.sleepCount > 2) {
    return "morning";
  }

  if (logs.patterns.nightActivity > 2) {
    return "night";
  }

  return "afternoon";
};

export const resolveAction = (
  intent: ActionIntent,
  scene: SceneId,
  logs: LogState
): ActionParams => {
  const time = deriveTime(intent, logs);

  const base = {
    intent,
    scene,
    time,
    region: scene,
    moneyDelta: 0,
    energyDelta: 0,
  } satisfies ActionParams;

  switch (intent) {
    case "sleep":
      return { ...base, energyDelta: 2, moneyDelta: 0 };
    case "cook":
      return { ...base, energyDelta: 1, moneyDelta: -1 };
    case "shop":
      return { ...base, energyDelta: -1, moneyDelta: -2 };
    case "go_out":
      return { ...base, energyDelta: -1, moneyDelta: 0 };
    default:
      return base;
  }
};
