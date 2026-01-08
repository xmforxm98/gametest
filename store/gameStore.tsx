"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { resolveAction } from "@/lib/engine/actionResolver";
import { resolveEvent } from "@/lib/engine/eventResolver";
import {
  applyEventEffects,
  createInitialLogs,
  deriveEmotionalState,
} from "@/lib/engine/logStore";
import { createEventSeed } from "@/lib/engine/seed";
import { getAvailableActions, getNextScene } from "@/lib/engine/sceneManager";
import { locations } from "@/lib/data/locations";
import { resolveEnding } from "@/lib/engine/endingResolver";
import type {
  ActionIntent,
  ActionParams,
  EndingResult,
  LogState,
  Message,
  NarrationResponse,
  SceneId,
} from "@/types/game";

const createId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const createIntroMessages = (): Message[] => [
  {
    id: createId(),
    role: "system",
    content: "You arrive with a single keycard and a quiet list of rules.",
  },
];

type GameState = {
  scene: SceneId;
  logs: LogState;
  messages: Message[];
  isResolving: boolean;
  debugOpen: boolean;
  ending: EndingResult;
  lastEventId: string | null;
  lastSeed: number | null;
  lastParams: ActionParams | null;
  dayIndex: number;
  playerId: string;
};

type GameAction =
  | { type: "toggle_debug" }
  | { type: "reset"; payload: GameState }
  | { type: "start_resolve" }
  | {
      type: "finish_resolve";
      payload: {
        scene: SceneId;
        logs: LogState;
        ending: EndingResult;
        messages: Message[];
        lastEventId: string;
        lastSeed: number;
        lastParams: ActionParams;
        dayIndex: number;
      };
    };

const initialLogs = createInitialLogs();

const initialState: GameState = {
  scene: "dorm",
  logs: initialLogs,
  messages: createIntroMessages(),
  isResolving: false,
  debugOpen: false,
  ending: resolveEnding(initialLogs),
  lastEventId: null,
  lastSeed: null,
  lastParams: null,
  dayIndex: 0,
  playerId: "player-001",
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "toggle_debug":
      return { ...state, debugOpen: !state.debugOpen };
    case "reset":
      return action.payload;
    case "start_resolve":
      return { ...state, isResolving: true };
    case "finish_resolve":
      return {
        ...state,
        scene: action.payload.scene,
        logs: action.payload.logs,
        ending: action.payload.ending,
        messages: action.payload.messages,
        isResolving: false,
        lastEventId: action.payload.lastEventId,
        lastSeed: action.payload.lastSeed,
        lastParams: action.payload.lastParams,
        dayIndex: action.payload.dayIndex,
      };
    default:
      return state;
  }
};

type GameContextValue = GameState & {
  getActions: () => ActionIntent[];
  toggleDebug: () => void;
  reset: () => void;
  performAction: (intent: ActionIntent) => Promise<void>;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const getActions = useCallback(
    () => getAvailableActions(state.scene),
    [state.scene]
  );

  const toggleDebug = useCallback(() => {
    dispatch({ type: "toggle_debug" });
  }, []);

  const reset = useCallback(() => {
    const freshLogs = createInitialLogs();
    dispatch({
      type: "reset",
      payload: {
        ...initialState,
        logs: freshLogs,
        messages: createIntroMessages(),
        ending: resolveEnding(freshLogs),
      },
    });
  }, []);

  const performAction = useCallback(
    async (intent: ActionIntent) => {
      dispatch({ type: "start_resolve" });

      const params = resolveAction(intent, state.scene, state.logs);
      const seedInfo = createEventSeed({
        dayIndex: state.dayIndex,
        playerId: state.playerId,
        scene: state.scene,
        intent,
        logs: state.logs,
      });
      const event = resolveEvent(state.scene, params, state.logs, seedInfo.seed);
      const nextLogs = applyEventEffects(state.logs, event);
      const emotionalState = deriveEmotionalState(nextLogs);
      const sceneLabel =
        locations.find((location) => location.id === state.scene)?.label ??
        "Scene";

      let narration: NarrationResponse = {
        narration: event.summary,
        npcDialogue: "",
        tone: "neutral",
      };

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event.id,
            scene: sceneLabel,
            emotionalState,
          }),
        });

        if (response.ok) {
          narration = (await response.json()) as NarrationResponse;
        }
      } catch {
        narration = {
          narration: event.summary,
          npcDialogue: "",
          tone: "neutral",
        };
      }

      const nextScene = getNextScene(state.scene);
      const nextEnding = resolveEnding(nextLogs);
      const nextMessages: Message[] = [
        ...state.messages,
        {
          id: createId(),
          role: "player",
          content: `Action: ${intent.replace("_", " ")}`,
        },
        {
          id: createId(),
          role: "narrator",
          content: narration.narration,
        },
        ...(narration.npcDialogue
          ? [
              {
                id: createId(),
                role: "npc",
                content: narration.npcDialogue,
              },
            ]
          : []),
      ];

      dispatch({
        type: "finish_resolve",
        payload: {
          scene: nextScene,
          logs: nextLogs,
          ending: nextEnding,
          messages: nextMessages,
          lastEventId: event.id,
          lastSeed: seedInfo.seed,
          lastParams: params,
          dayIndex: state.dayIndex + 1,
        },
      });
    },
    [state]
  );

  const value = useMemo(
    () => ({
      ...state,
      getActions,
      toggleDebug,
      reset,
      performAction,
    }),
    [state, getActions, toggleDebug, reset, performAction]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameStore = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameStore must be used within GameProvider.");
  }
  return context;
};
