import { events } from "@/lib/data/events";
import type { ActionParams, EventDefinition, LogState, SceneId } from "@/types/game";

const conditionsMet = (
  event: EventDefinition,
  logs: LogState
): boolean => {
  const conditions = event.conditions;
  if (!conditions) {
    return true;
  }

  if (conditions.minHumanity !== undefined && logs.humanity < conditions.minHumanity) {
    return false;
  }

  if (conditions.maxHumanity !== undefined && logs.humanity > conditions.maxHumanity) {
    return false;
  }

  if (conditions.minExposure !== undefined && logs.exposure < conditions.minExposure) {
    return false;
  }

  if (conditions.maxExposure !== undefined && logs.exposure > conditions.maxExposure) {
    return false;
  }

  if (
    conditions.minCityAttachment !== undefined &&
    logs.cityAttachment < conditions.minCityAttachment
  ) {
    return false;
  }

  if (
    conditions.maxCityAttachment !== undefined &&
    logs.cityAttachment > conditions.maxCityAttachment
  ) {
    return false;
  }

  if (
    conditions.minNightActivity !== undefined &&
    logs.patterns.nightActivity < conditions.minNightActivity
  ) {
    return false;
  }

  if (conditions.minSpending !== undefined && logs.patterns.spending < conditions.minSpending) {
    return false;
  }

  if (conditions.minSleep !== undefined && logs.patterns.sleepCount < conditions.minSleep) {
    return false;
  }

  if (conditions.relationshipAtLeast) {
    for (const [character, minValue] of Object.entries(
      conditions.relationshipAtLeast
    )) {
      const key = character as keyof LogState["relationshipInfiltration"];
      if ((logs.relationshipInfiltration[key] ?? 0) < (minValue ?? 0)) {
        return false;
      }
    }
  }

  return true;
};

const pickEvent = (list: EventDefinition[], seed: number): EventDefinition => {
  if (list.length === 0) {
    return events[0];
  }

  const index = seed % list.length;
  return list[index];
};

export const resolveEvent = (
  scene: SceneId,
  _params: ActionParams,
  logs: LogState,
  seed: number
): EventDefinition => {
  const candidates = events
    .filter((event) => event.scene === scene)
    .filter((event) => conditionsMet(event, logs));

  const ordered = [...candidates].sort((a, b) => a.id.localeCompare(b.id));
  const fallback = events
    .filter((event) => event.scene === scene)
    .sort((a, b) => a.id.localeCompare(b.id));

  return pickEvent(ordered.length > 0 ? ordered : fallback, seed);
};
