import type {
  EventDefinition,
  EmotionalState,
  NarrationResponse,
} from "@/types/game";

const toneMap: Record<EmotionalState["mood"], string> = {
  calm: "steady and observational",
  tense: "short, controlled sentences",
  warm: "soft and reflective",
  guarded: "measured with subtext",
};

const focusLead: Record<EmotionalState["focus"], string> = {
  self: "You keep your thoughts close.",
  city: "The city hums in the background.",
  connection: "A familiar presence lingers nearby.",
};

export const createNarration = (
  event: EventDefinition,
  sceneLabel: string,
  emotionalState: EmotionalState
): NarrationResponse => {
  const tone = toneMap[emotionalState.mood];
  const focusLine = focusLead[emotionalState.focus];

  return {
    narration: `${event.summary} ${focusLine}`,
    npcDialogue: `"${sceneLabel} feels different tonight," someone murmurs.`,
    tone,
  };
};
