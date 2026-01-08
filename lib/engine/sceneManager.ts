import { ActionIntent, SceneId } from "@/types/game";

export type SceneDefinition = {
  id: SceneId;
  label: string;
  next: SceneId;
  actions: ActionIntent[];
};

export const scenes: Record<SceneId, SceneDefinition> = {
  dorm: {
    id: "dorm",
    label: "Dorm",
    next: "city",
    actions: ["sleep", "cook", "go_out"],
  },
  city: {
    id: "city",
    label: "City",
    next: "cafe",
    actions: ["shop", "go_out"],
  },
  cafe: {
    id: "cafe",
    label: "Cafe",
    next: "dorm",
    actions: ["cook", "go_out"],
  },
};

export const getSceneDefinition = (scene: SceneId): SceneDefinition =>
  scenes[scene];

export const getNextScene = (scene: SceneId): SceneId => scenes[scene].next;

export const getAvailableActions = (scene: SceneId): ActionIntent[] =>
  scenes[scene].actions;
