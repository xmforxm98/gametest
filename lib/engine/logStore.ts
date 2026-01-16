import type {
  EmotionalState,
  EventDefinition,
  LogState,
  LogPatterns,
} from "@/types/game";
import { characters } from "@/lib/data/characters";

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const createInitialPatterns = (): LogPatterns => ({
  sleepCount: 0,
  spending: 0,
  nightActivity: 0,
});

export const createInitialLogs = (): LogState => ({
  humanity: 5,
  exposure: 0,
  cityAttachment: 0,
  relationshipInfiltration: characters.reduce((acc, character) => {
    acc[character.id] = 0;
    return acc;
  }, {} as LogState["relationshipInfiltration"]),
  patterns: createInitialPatterns(),
});

export const applyEventEffects = (
  logs: LogState,
  event: EventDefinition
): LogState => {
  const next: LogState = {
    ...logs,
    humanity: clamp(
      logs.humanity + (event.logEffects.humanity ?? 0),
      0,
      10
    ),
    exposure: clamp(
      logs.exposure + (event.logEffects.exposure ?? 0),
      0,
      10
    ),
    cityAttachment: clamp(
      logs.cityAttachment + (event.logEffects.cityAttachment ?? 0),
      0,
      10
    ),
    patterns: {
      ...logs.patterns,
    },
    relationshipInfiltration: {
      ...logs.relationshipInfiltration,
    },
  };

  if (event.patternEffects) {
    next.patterns = {
      sleepCount: clamp(
        next.patterns.sleepCount + (event.patternEffects.sleepCount ?? 0),
        0,
        10
      ),
      spending: clamp(
        next.patterns.spending + (event.patternEffects.spending ?? 0),
        0,
        10
      ),
      nightActivity: clamp(
        next.patterns.nightActivity + (event.patternEffects.nightActivity ?? 0),
        0,
        10
      ),
    };
  }

  if (event.relationshipEffects) {
    for (const [characterId, delta] of Object.entries(
      event.relationshipEffects
    )) {
      const current = next.relationshipInfiltration[
        characterId as keyof LogState["relationshipInfiltration"]
      ];
      next.relationshipInfiltration[
        characterId as keyof LogState["relationshipInfiltration"]
      ] = clamp(current + (delta ?? 0), 0, 10);
    }
  }

  return next;
};

export const deriveEmotionalState = (logs: LogState): EmotionalState => {
  if (logs.exposure >= 7) {
    return { mood: "tense", focus: "self" };
  }

  if (logs.cityAttachment >= 6) {
    return { mood: "warm", focus: "city" };
  }

  if (Object.values(logs.relationshipInfiltration).some((value) => value >= 5)) {
    return { mood: "warm", focus: "connection" };
  }

  if (logs.humanity <= 3) {
    return { mood: "guarded", focus: "self" };
  }

  return { mood: "calm", focus: "self" };
};
