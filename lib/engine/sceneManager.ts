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
    next: "company",
    actions: ["sleep", "cook", "go_out"],
  },
  company: {
    id: "company",
    label: "Company",
    next: "city",
    actions: ["go_out", "shop"],
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
    next: "bar",
    actions: ["cook", "go_out"],
  },
  bar: {
    id: "bar",
    label: "Bar",
    next: "dorm",
    actions: ["go_out", "sleep"],
  },
};

export const getSceneDefinition = (scene: SceneId): SceneDefinition =>
  scenes[scene];

export const getNextScene = (scene: SceneId): SceneId => scenes[scene].next;

export const getAvailableActions = (scene: SceneId): ActionIntent[] =>
  scenes[scene].actions;
