export type SceneId = "dorm" | "city" | "cafe";

export type ActionIntent = "sleep" | "go_out" | "cook" | "shop";

export type TimeOfDay = "morning" | "afternoon" | "night";

export type CharacterId = "ryo" | "jin" | "min";

export type EventCondition = {
  minHumanity?: number;
  maxHumanity?: number;
  minExposure?: number;
  maxExposure?: number;
  minCityAttachment?: number;
  maxCityAttachment?: number;
  minNightActivity?: number;
  minSpending?: number;
  minSleep?: number;
  relationshipAtLeast?: Partial<Record<CharacterId, number>>;
};

export type EventDefinition = {
  id: string;
  scene: SceneId;
  title: string;
  summary: string;
  conditions?: EventCondition;
  logEffects: Partial<LogState>;
  patternEffects?: Partial<LogPatterns>;
  relationshipEffects?: Partial<Record<CharacterId, number>>;
  followUp?: string;
};

export type ActionParams = {
  intent: ActionIntent;
  scene: SceneId;
  time: TimeOfDay;
  region: SceneId;
  moneyDelta: number;
  energyDelta: number;
};

export type LogPatterns = {
  sleepCount: number;
  spending: number;
  nightActivity: number;
};

export type LogState = {
  humanity: number;
  exposure: number;
  cityAttachment: number;
  relationshipInfiltration: Record<CharacterId, number>;
  patterns: LogPatterns;
};

export type EmotionalState = {
  mood: "calm" | "tense" | "warm" | "guarded";
  focus: "self" | "city" | "connection";
};

export type NarrationResponse = {
  narration: string;
  npcDialogue: string;
  tone: string;
};

export type Message = {
  id: string;
  role: "player" | "narrator" | "npc" | "system";
  content: string;
};

export type EndingResult = {
  lead: CharacterId;
  endingType: "bound" | "exposed" | "quiet" | "neutral";
};
