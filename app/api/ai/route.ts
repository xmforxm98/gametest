import { NextResponse } from "next/server";
import { createNarration } from "@/lib/ai/narration";
import { events } from "@/lib/data/events";
import type { EmotionalState } from "@/types/game";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();

  const eventId = body?.eventId as string;
  const scene = body?.scene as string;
  const emotionalState = body?.emotionalState as EmotionalState;

  const event = events.find((entry) => entry.id === eventId);

  if (!event || !scene || !emotionalState?.mood) {
    return NextResponse.json(
      { error: "Invalid narration payload." },
      { status: 400 }
    );
  }

  const narration = createNarration(
    event,
    scene,
    emotionalState
  );

  return NextResponse.json(narration);
}
