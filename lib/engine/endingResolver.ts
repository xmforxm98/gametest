import { characters } from "@/lib/data/characters";
import type { EndingResult, LogState } from "@/types/game";

export const resolveEnding = (logs: LogState): EndingResult => {
  const sorted = [...characters].sort((a, b) => {
    const scoreA = logs.relationshipInfiltration[a.id] ?? 0;
    const scoreB = logs.relationshipInfiltration[b.id] ?? 0;
    if (scoreA === scoreB) {
      return a.id.localeCompare(b.id);
    }
    return scoreB - scoreA;
  });

  const lead = sorted[0]?.id ?? "ryo";

  let endingType: EndingResult["endingType"] = "neutral";

  if (logs.exposure >= 8 && logs.humanity <= 3) {
    endingType = "exposed";
  } else if (logs.cityAttachment >= 7) {
    endingType = "bound";
  } else if (logs.humanity >= 7) {
    endingType = "quiet";
  }

  return {
    lead,
    endingType,
  };
};
