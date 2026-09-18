import { useEffect, useState } from "react";
import { fetchDrivers, ModelDriver } from "@/lib/api";
import { VesselClassId } from "@/lib/simulationEngine";

function toBackendVessel(id: VesselClassId): string {
  if (id === "handysize") return "Handysize";
  if (id === "supramax") return "Supramax";
  if (id === "capesize") return "Capesize";
  return "Panamax";
}

const MODEL_DRIVER_FALLBACK = {
  drivers: [
    { feature: "bpi_index", importance: 100, weight: 1.0 },
    { feature: "tonnage_supply", importance: 68, weight: 0.3 },
    { feature: "fuel_bunker", importance: 54, weight: 0.18 },
  ] as ModelDriver[],
  narrative: "Backend unavailable — showing cached driver weights from the last known model snapshot.",
};

export function useModelDrivers(vesselId: VesselClassId): { drivers: ModelDriver[]; narrative: string; isLoading: boolean; error: string | null; retry: () => void } {
  const [drivers, setDrivers] = useState<ModelDriver[]>([]);
  const [narrative, setNarrative] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true); setError(null);
    fetchDrivers(toBackendVessel(vesselId)).then((r) => {
      if (cancelled) return;
      setDrivers(r.drivers); setNarrative(r.narrative);
    }).catch((e) => {
      if (cancelled) return;
      setError(e instanceof Error ? e.message : String(e));
      setDrivers(MODEL_DRIVER_FALLBACK.drivers);
      setNarrative(MODEL_DRIVER_FALLBACK.narrative);
    })
    .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [vesselId, attempt]);
  return { drivers, narrative, isLoading, error, retry: () => { setAttempt((a) => a + 1); } };
}
