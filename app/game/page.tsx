"use client";

import { useMemo } from "react";
import { locations } from "@/lib/data/locations";
import { getSceneDefinition } from "@/lib/engine/sceneManager";
import { GameProvider, useGameStore } from "@/store/gameStore";

const actionLabels: Record<string, string> = {
  sleep: "Sleep",
  cook: "Cook",
  go_out: "Go Out",
  shop: "Shop",
};

const GameContent = () => {
  const {
    scene,
    messages,
    isResolving,
    debugOpen,
    logs,
    ending,
    lastEventId,
    lastSeed,
    lastParams,
    toggleDebug,
    reset,
    performAction,
    getActions,
  } = useGameStore();

  const sceneInfo = useMemo(
    () => locations.find((location) => location.id === scene),
    [scene]
  );

  const sceneDefinition = getSceneDefinition(scene);
  const actions = getActions();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-2 rounded-2xl bg-zinc-900/70 p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                Scene
              </p>
              <h1 className="text-2xl font-semibold">
                {sceneInfo?.label ?? sceneDefinition.label}
              </h1>
              <p className="text-sm text-zinc-400">
                {sceneInfo?.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleDebug}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-400"
              >
                {debugOpen ? "Hide" : "Show"} Debug
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
              >
                Reset
              </button>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Story Feed
          </div>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  message.role === "player"
                    ? "self-end bg-zinc-200 text-zinc-900"
                    : message.role === "npc"
                    ? "bg-zinc-800 text-zinc-200"
                    : message.role === "system"
                    ? "bg-zinc-900 text-zinc-400"
                    : "bg-zinc-800/70 text-zinc-100"
                }`}
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {message.role}
                </span>
                <span>{message.content}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Actions
          </div>
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => void performAction(action)}
                disabled={isResolving}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-500"
              >
                {actionLabels[action] ?? action}
              </button>
            ))}
          </div>
          {isResolving ? (
            <p className="text-xs text-zinc-500">Narrating outcome...</p>
          ) : null}
        </section>

        {debugOpen ? (
          <section className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/70 p-6 text-xs text-zinc-200">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Log State
                </p>
                <pre className="mt-2 whitespace-pre-wrap text-xs">
                  {JSON.stringify(logs, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Last Resolution
                </p>
                <pre className="mt-2 whitespace-pre-wrap text-xs">
                  {JSON.stringify(
                    {
                      eventId: lastEventId,
                      seed: lastSeed,
                      params: lastParams,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Ending Preview
                </p>
                <pre className="mt-2 whitespace-pre-wrap text-xs">
                  {JSON.stringify(ending, null, 2)}
                </pre>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default function GamePage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
