// src/components/ControlMVP.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BatteryCharging,
  Layers,
  Zap,
  Fuel,
  RefreshCw,
  HardHat,
} from "lucide-react";

/**
 * ControlMVP.tsx — UI/UX refinado (visual profissional/didático)
 * - Mantém toda lógica anterior (simulação, presets, eventos).
 * - Apenas altera aparência e hierarquia visual.
 *
 * Observação: espera-se que as classes/tokens usados existam no tailwind.config:
 * - bg-gradient-mission
 * - bg-panel, bg-background
 * - text-accent, text-primary, text-success, text-warning, text-destructive
 * - border-border, bg-muted-foreground/5 etc.
 */

/* -------------------- Theme tokens (fallback safe) -------------------- */
const theme = {
  accent: "text-accent",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  panel: "bg-panel",
  background: "bg-background",
  border: "border-border",
};

/* -------------------- Helpers / Types (unchanged) -------------------- */

type Mode = "pyrolysis" | "fusion" | "compact";

type KPIs = {
  energy_kwh: number;
  materials_processed_kg: number;
  materials_total_kg: number;
  fuel_liters: number;
  parts_kg: number;
  efficiency_pct: number;
  esm_saved_kg: number;
  co2ConvertedKg: number;
};

type ModuleStatus = {
  id: string;
  name: string;
  state: "ACTIVE" | "DEGRADED" | "SYNCED" | string;
  health: number;
  units?: string;
};

type EventItem = {
  id: number;
  time: string;
  source: string;
  type: string;
  message: string;
  detail?: string;
};

type AppState = {
  mission: {
    name: string;
    sol: number;
    sol_total: number;
    status: string;
    mission_time: string;
    local_time: string;
  };
  kpis: KPIs;
  modules: ModuleStatus[];
  events: EventItem[];
};

type SimResult = {
  fuel_mass_kg?: number;
  fuel_liters?: number;
  fuel_energy_kwh?: number;
  process_energy_kwh: number;
  net_energy_kwh: number;
  delta_ESM_total: number;
  delta_ESM_breakdown: { from_energy: number; from_primary: number };
  confidence: number;
  mode: Mode;
  batchKg: number;
};

const fmt = (n: number | undefined, d = 1) => (n === undefined ? "-" : Number(n).toFixed(d));
let uidCounter = 1000;
const uid = () => ++uidCounter;

/* -------------------- Simulation constants (unchanged) -------------------- */
const ENERGY_DENSITY_FUEL = 15.4;
const OIL_YIELD_PYROLYSIS = 0.6;
const REACTOR_ENERGY_CONSUMPTION_PER_KG = 2.1;
const PROCESS_EFFICIENCY = 0.92;
const KWH_TO_ESM_FACTOR = 0.04;
const FUEL_DENSITY_KG_PER_L = 0.7;
const BULK_DENSITY_COMPACT = 50;
const VEQ = 17.6;

/* -------------------- Initial state (unchanged) -------------------- */
const INITIAL_STATE: AppState = {
  mission: {
    name: "Mars Alpha",
    sol: 892,
    sol_total: 1095,
    status: "OPERATIONAL",
    mission_time: "892:14:23:45",
    local_time: "2025-09-30T14:23:45Z",
  },
  kpis: {
    energy_kwh: 2340,
    materials_processed_kg: 7820,
    materials_total_kg: 12600,
    fuel_liters: 890,
    parts_kg: 275,
    efficiency_pct: 94.0,
    esm_saved_kg: 0,
    co2ConvertedKg: 890,
  },
  modules: [
    { id: "reactor", name: "Modular Reactor", state: "ACTIVE", health: 98.2 },
    { id: "power", name: "Energy Bank", state: "ACTIVE", health: 96.7 },
    { id: "robots", name: "Robot Swarm", state: "DEGRADED", health: 72.1, units: "5/7" },
    { id: "isru", name: "ISRU Mars", state: "SYNCED", health: 92.1 },
  ],
  events: [
    {
      id: 1,
      time: new Date().toISOString(),
      source: "SYSTEM",
      type: "info",
      message: "PIGRE MVP initialized",
      detail: "Mock session start",
    },
  ],
};

/* -------------------- Sim engine (unchanged) -------------------- */
function simulateBatch(mode: Mode, batchKg: number, robotAllocationPct: number): SimResult {
  const allocationFactor = Math.min(Math.max(robotAllocationPct / 100, 0.1), 1);

  if (mode === "pyrolysis") {
    const fuel_mass_kg = batchKg * OIL_YIELD_PYROLYSIS;
    const fuel_energy_kwh = fuel_mass_kg * ENERGY_DENSITY_FUEL * PROCESS_EFFICIENCY;
    const process_energy_kwh = batchKg * REACTOR_ENERGY_CONSUMPTION_PER_KG;
    const net_energy_kwh = fuel_energy_kwh - process_energy_kwh;
    const delta_ESM_from_energy = net_energy_kwh * KWH_TO_ESM_FACTOR;
    const delta_ESM_from_fuel = fuel_mass_kg;
    const delta_ESM_total = delta_ESM_from_energy + delta_ESM_from_fuel;
    const fuel_liters = fuel_mass_kg / FUEL_DENSITY_KG_PER_L;
    const confidence = PROCESS_EFFICIENCY * allocationFactor;
    return {
      fuel_mass_kg,
      fuel_liters,
      fuel_energy_kwh,
      process_energy_kwh,
      net_energy_kwh,
      delta_ESM_total,
      delta_ESM_breakdown: { from_energy: delta_ESM_from_energy, from_primary: delta_ESM_from_fuel },
      confidence,
      mode,
      batchKg,
    };
  }

  if (mode === "fusion") {
    const metal_yield = 0.85;
    const metal_recovery_kg = batchKg * metal_yield;
    const process_energy_kwh = batchKg * REACTOR_ENERGY_CONSUMPTION_PER_KG * 1.5;
    const net_energy_kwh = -process_energy_kwh;
    const delta_ESM_from_metal = metal_recovery_kg * 0.8;
    const delta_ESM_from_energy = net_energy_kwh * KWH_TO_ESM_FACTOR;
    const delta_ESM_total = Math.max(0, delta_ESM_from_metal + delta_ESM_from_energy);
    const confidence = 0.85 * (robotAllocationPct / 100);
    return {
      process_energy_kwh,
      net_energy_kwh,
      delta_ESM_total,
      delta_ESM_breakdown: { from_energy: delta_ESM_from_energy, from_primary: delta_ESM_from_metal },
      confidence,
      mode,
      batchKg,
    } as SimResult;
  }

  const volume_saved_m3 = batchKg / BULK_DENSITY_COMPACT;
  const delta_ESM_from_volume = volume_saved_m3 * VEQ;
  const process_energy_kwh = batchKg * 0.1;
  const net_energy_kwh = -process_energy_kwh;
  const delta_ESM_total = delta_ESM_from_volume;
  const confidence = 0.95 * (robotAllocationPct / 100);
  return {
    process_energy_kwh,
    net_energy_kwh,
    delta_ESM_total,
    delta_ESM_breakdown: { from_energy: net_energy_kwh * KWH_TO_ESM_FACTOR, from_primary: delta_ESM_from_volume },
    confidence,
    mode,
    batchKg,
  } as SimResult;
}

/* -------------------- Small UI helpers -------------------- */
const Small: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="text-xs font-mono text-muted-foreground">{children}</div>
);

const Badge: React.FC<{ children?: React.ReactNode; tone?: "muted" | "success" | "warn" }> = ({ children, tone = "muted" }) => {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono";
  const toneClass = tone === "success" ? "bg-success/10 text-success border border-success/20" : tone === "warn" ? "bg-warning/10 text-warning border border-warning/20" : "bg-muted-foreground/5 text-muted-foreground border border-border";
  return <span className={`${base} ${toneClass}`}>{children}</span>;
};

/* -------------------- Component -------------------- */

export default function ControlMVP(): JSX.Element {
  const [appState, setAppState] = useState<AppState>(() => JSON.parse(JSON.stringify(INITIAL_STATE)));
  const [mode, setMode] = useState<Mode>("pyrolysis");
  const [batchKg, setBatchKg] = useState<number>(100);
  const [robotAllocation, setRobotAllocation] = useState<number>(100);
  const [lastSim, setLastSim] = useState<SimResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [events, setEvents] = useState<EventItem[]>(appState.events || []);
  const [deltaPill, setDeltaPill] = useState<{ kpi: string; value: string } | null>(null);
  const deltaTimer = useRef<number | null>(null);
  const [comparison, setComparison] = useState<null | { before: KPIs; after: KPIs }>(null);
  const comparisonTimer = useRef<number | null>(null);

  useEffect(() => {
    (window as any).getSnapshot = () => ({ kpis: appState.kpis, esm_total: appState.kpis.esm_saved_kg, events });
    (window as any).playbackRunner = (preset: "Day210Surge" | "EmergencyFuel" | "SteadyRun" = "Day210Surge") =>
      runPreset(preset);
  }, [appState, events]);

  const processedPercent = useMemo(
    () => (appState.kpis.materials_processed_kg / appState.kpis.materials_total_kg) * 100,
    [appState.kpis.materials_processed_kg, appState.kpis.materials_total_kg]
  );

  function pushEvent(source: string, type: string, message: string, detail = "") {
    const e: EventItem = { id: uid(), time: new Date().toISOString(), source, type, message, detail };
    setEvents((prev) => [e, ...prev].slice(0, 200));
  }

  function showDelta(kpi: string, value: string) {
    setDeltaPill({ kpi, value });
    if (deltaTimer.current) window.clearTimeout(deltaTimer.current);
    deltaTimer.current = window.setTimeout(() => setDeltaPill(null), 2200);
  }

  function applySimResult(sim: SimResult) {
    setAppState((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as AppState;
      next.kpis.energy_kwh = Math.max(0, next.kpis.energy_kwh - (sim.process_energy_kwh || 0));
      if (sim.fuel_liters) next.kpis.fuel_liters = Math.max(0, next.kpis.fuel_liters + sim.fuel_liters);
      next.kpis.materials_processed_kg = Math.min(next.kpis.materials_total_kg, next.kpis.materials_processed_kg + sim.batchKg);
      if (sim.mode === "fusion" && sim.delta_ESM_breakdown.from_primary) {
        next.kpis.parts_kg = next.kpis.parts_kg + sim.delta_ESM_breakdown.from_primary * 0.5;
      }
      next.kpis.esm_saved_kg = Math.max(0, next.kpis.esm_saved_kg + sim.delta_ESM_total);
      const effGain = Math.min(3, (sim.delta_ESM_total / 100) * 0.5);
      next.kpis.efficiency_pct = Math.min(99.9, next.kpis.efficiency_pct + effGain);
      return next;
    });

    pushEvent("SIM", "process", `Processed ${sim.batchKg} kg via ${sim.mode.toUpperCase()}`, `ΔESM=${fmt(sim.delta_ESM_total, 2)} kg-eq`);
    if (sim.fuel_liters) showDelta("fuel", `+${fmt(sim.fuel_liters, 1)} L`);
    showDelta("esm", `+${fmt(sim.delta_ESM_total, 2)} kg-eq`);
  }

  function handleRunSimulate() {
    const sim = simulateBatch(mode, batchKg, robotAllocation);
    setLastSim(sim);
    setShowCalc(false);
    setShowModal(true);
  }

  function handleConfirmApply() {
    if (!lastSim) return;
    const before = { ...appState.kpis };
    const after: KPIs = { ...before };
    after.energy_kwh = Math.max(0, before.energy_kwh - (lastSim.process_energy_kwh || 0));
    if (lastSim.fuel_liters) after.fuel_liters = Math.max(0, before.fuel_liters + lastSim.fuel_liters);
    after.materials_processed_kg = Math.min(before.materials_total_kg, before.materials_processed_kg + lastSim.batchKg);
    if (lastSim.mode === "fusion" && lastSim.delta_ESM_breakdown.from_primary) {
      after.parts_kg = before.parts_kg + lastSim.delta_ESM_breakdown.from_primary * 0.5;
    }
    after.esm_saved_kg = Math.max(0, before.esm_saved_kg + lastSim.delta_ESM_total);
    const effGain = Math.min(3, (lastSim.delta_ESM_total / 100) * 0.5);
    after.efficiency_pct = Math.min(99.9, before.efficiency_pct + effGain);

    setComparison({ before, after });
    if (comparisonTimer.current) window.clearTimeout(comparisonTimer.current);
    comparisonTimer.current = window.setTimeout(() => setComparison(null), 9000);

    applySimResult(lastSim);
    setShowModal(false);
  }

  function exportCSV() {
    const headers = ["timestamp", "energy_kwh", "materials_processed_kg", "materials_total_kg", "fuel_liters", "parts_kg", "efficiency_pct", "esm_saved_kg"];
    const k = appState.kpis;
    const row = [new Date().toISOString(), k.energy_kwh, k.materials_processed_kg, k.materials_total_kg, k.fuel_liters, k.parts_kg, k.efficiency_pct, k.esm_saved_kg];
    const eventsRows = events.slice(0, 30).map((e) => [e.time, e.source, e.type, e.message, e.detail || ""].join(","));
    const csv = [headers.join(","), row.join(",")].concat(["", "EVENTS"]).concat(eventsRows).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pigre_snapshot_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    pushEvent("SYSTEM", "export", "Export CSV generated", "");
  }

  const PRESETS: Record<string, { mode: Mode; batch: number }[]> = {
    Day210Surge: [
      { mode: "pyrolysis", batch: 100 },
      { mode: "pyrolysis", batch: 150 },
      { mode: "pyrolysis", batch: 200 },
    ],
    EmergencyFuel: [
      { mode: "pyrolysis", batch: 200 },
      { mode: "pyrolysis", batch: 200 },
    ],
    SteadyRun: [
      { mode: "compact", batch: 75 },
      { mode: "compact", batch: 75 },
      { mode: "compact", batch: 75 },
      { mode: "compact", batch: 75 },
    ],
  };

  function runPreset(name: keyof typeof PRESETS) {
    const seq = PRESETS[name];
    if (!seq) return;
    pushEvent("SYSTEM", "playback", `Preset ${name} started`, "");
    let idx = 0;
    const step = () => {
      if (!seq[idx]) {
        pushEvent("SYSTEM", "playback", `Preset ${name} finished`, "");
        return;
      }
      const item = seq[idx];
      const sim = simulateBatch(item.mode, item.batch, robotAllocation);
      setLastSim(sim);
      applySimResult(sim);
      idx++;
      setTimeout(step, 700);
    };
    step();
  }

  function computePie(sim: SimResult | null) {
    if (!sim) return { slices: [], total: 0 };
    const input = sim.batchKg;
    const fuel = sim.fuel_mass_kg || 0;
    const primary = sim.delta_ESM_breakdown.from_primary || 0;
    const leftover = Math.max(0, input - (fuel + primary));
    const lossEquivalent = sim.net_energy_kwh < 0 ? Math.abs(sim.net_energy_kwh) / (ENERGY_DENSITY_FUEL || 1) : 0;
    const slices = [
      { key: "fuel", label: "Combustível (usável)", value: fuel, color: "#32d296" },
      { key: "primary", label: sim.mode === "fusion" ? "Peças (3D)" : "Material reutilizável", value: primary, color: "#00a3ff" },
      { key: "leftover", label: "Resíduo (resto)", value: leftover, color: "#7c4dff" },
      { key: "loss", label: "Perdas (eq)", value: lossEquivalent, color: "#ffb020" },
    ];
    const total = slices.reduce((s, it) => s + it.value, 0);
    return { slices, total: Math.max(total, 1) };
  }

  const pie = computePie(lastSim);

  function sankeyWidths(sim: SimResult | null) {
    if (!sim) return { primaryPct: 0, leftoverPct: 100 };
    const input = sim.batchKg;
    const primary = sim.fuel_mass_kg || sim.delta_ESM_breakdown.from_primary || 0;
    const leftover = Math.max(0, input - primary);
    const primaryPct = Math.round((primary / input) * 100) || 0;
    const leftoverPct = Math.max(0, 100 - primaryPct);
    return { primaryPct, leftoverPct };
  }

  const sankey = sankeyWidths(lastSim);
  const pyroExample = useMemo(() => simulateBatch("pyrolysis", 100, 100), []);

  /* -------------------- Render -------------------- */
  return (
    <div className="min-h-screen bg-gradient-mission font-technical text-foreground pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-4">
              <div className="text-accent font-mono uppercase tracking-widest text-sm">PIGRE · Mission Control</div>
              <div className="text-[13px] font-mono text-muted-foreground">
                {appState.mission.name} · SOL {appState.mission.sol}/{appState.mission.sol_total}
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              Status: <span className="text-success ml-2">{appState.mission.status}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-muted-foreground text-right">
              <div>Mission time: {appState.mission.mission_time}</div>
              <div>Local: {new Date(appState.mission.local_time).toLocaleString()}</div>
            </div>
            <div>
              <button
                onClick={() => runPreset("Day210Surge")}
                aria-label="Play Day210 preset"
                className="bg-accent text-black px-3 py-2 rounded-md font-mono text-sm shadow-sm hover:brightness-105"
              >
                ▶ Play Day210
              </button>
            </div>
          </div>
        </header>

        {/* Comparison */}
        {comparison && (
          <div className="rounded-md p-3 bg-gradient-to-r from-slate-800/65 to-slate-700/50 border border-accent/25 flex items-center justify-between">
            <div>
              <div className="text-sm font-mono text-muted-foreground">Comparação (Antes → Depois)</div>
              <div className="mt-1 text-xs font-mono text-muted-foreground">
                <div>ESM: <strong>{fmt(comparison.before.esm_saved_kg, 1)} → {fmt(comparison.after.esm_saved_kg, 1)} kg-eq</strong></div>
                <div>Fuel: <strong>{fmt(comparison.before.fuel_liters, 1)} → {fmt(comparison.after.fuel_liters, 1)} L</strong></div>
                <div>Processados: <strong>{fmt(comparison.before.materials_processed_kg, 0)} → {fmt(comparison.after.materials_processed_kg, 0)} kg</strong></div>
              </div>
            </div>
            <div>
              <button onClick={() => setComparison(null)} className="text-xs px-2 py-1 rounded-md border border-border font-mono">Fechar</button>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 items-stretch">
          <div className="lg:col-span-1 rounded-xl border border-accent/15 p-4 bg-panel/60 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background/20"><BatteryCharging className="h-5 w-5 text-primary" /></div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">ENERGIA DISPONÍVEL</div>
                <div className="text-xl font-mono font-semibold mt-1">{fmt(appState.kpis.energy_kwh, 1)} kWh</div>
                <div className="text-[11px] mt-1 text-muted-foreground">Consumo médio: 2.1 kWh/kg</div>
              </div>
            </div>
            {deltaPill?.kpi === "energy" && <div className="mt-3 text-sm font-mono text-success">{deltaPill.value}</div>}
          </div>

          <div className="lg:col-span-1 rounded-xl border border-accent/15 p-4 bg-panel/60 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background/20"><Layers className="h-5 w-5 text-accent" /></div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">MASSA RECICLADA</div>
                <div className="text-xl font-mono font-semibold mt-1">{fmt(appState.kpis.materials_processed_kg / 1000, 2)} T</div>
                <div className="text-[11px] mt-1 text-muted-foreground">Progresso: {fmt((appState.kpis.materials_processed_kg / appState.kpis.materials_total_kg) * 100, 1)}%</div>
              </div>
            </div>
            {deltaPill?.kpi === "materials" && <div className="mt-3 text-sm font-mono text-success">{deltaPill.value}</div>}
          </div>

          <div className="lg:col-span-1 rounded-xl border border-accent/15 p-4 bg-panel/60 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background/20"><Fuel className="h-5 w-5 text-success" /></div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">COMBUSTÍVEL</div>
                <div className="text-xl font-mono font-semibold mt-1">{fmt(appState.kpis.fuel_liters, 0)} L</div>
                <div className="text-[11px] mt-1 text-muted-foreground">Autonomia aprox.: 90 sols</div>
              </div>
            </div>
            {deltaPill?.kpi === "fuel" && <div className="mt-3 text-sm font-mono text-success">{deltaPill.value}</div>}
          </div>

          {/* ESM destaque (ocupa 3 colunas em lg) */}
          <div className="lg:col-span-3 rounded-2xl border-2 border-success/30 p-5 bg-panel/75 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-lg bg-success/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono text-muted-foreground">Economia logística</div>
                  <div className="text-[11px] px-2 py-0.5 rounded-md bg-muted-foreground/5 text-muted-foreground font-mono">kg-eq</div>
                </div>
                <div className="text-4xl font-mono font-extrabold mt-2">{fmt(appState.kpis.esm_saved_kg, 1)} <span className="text-sm text-muted-foreground">kg-eq</span></div>
                <div className="text-[12px] mt-1 text-muted-foreground">Eficiência média do sistema: {fmt(appState.kpis.efficiency_pct, 1)}%</div>
              </div>
              <div className="ml-2">
                <div className="text-xs font-mono text-muted-foreground mb-1">Legenda</div>
                <div className="flex flex-col gap-1">
                  <Badge tone="muted">ΔESM — economia (kg-eq)</Badge>
                  <Badge tone="success">Impacto positivo (combustível/peças)</Badge>
                </div>
              </div>
            </div>

            {deltaPill?.kpi === "esm" && <div className="mt-4 text-base font-mono text-success animate-pop">{deltaPill.value}</div>}
            <div className="mt-4">
              {/* small sparkline placeholder */}
              <div className="h-6 w-full rounded bg-background/20" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2 space-y-6">
            {/* Process control */}
            <section className="rounded-xl border border-accent/15 p-4 bg-panel/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-mono text-accent uppercase">Processamento de Resíduos</div>
                  <Small>Escolha o modo, defina lote e verifique o impacto estimado.</Small>
                </div>
                <div className="text-xs font-mono text-muted-foreground">Processado: {fmt(appState.kpis.materials_processed_kg, 0)} / {appState.kpis.materials_total_kg} kg</div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <Small>Modo</Small>
                  <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="w-full rounded-md p-2 bg-slate-800 border border-border font-mono">
                    <option value="pyrolysis">Pirólise — Lixo → Combustível</option>
                    <option value="fusion">Fusão — Recuperar metais</option>
                    <option value="compact">Compactação — Reduzir volume</option>
                  </select>
                </div>

                <div>
                  <Small>Batch (kg): {batchKg}</Small>
                  <input type="range" min={10} max={500} value={batchKg} onChange={(e) => setBatchKg(Number(e.target.value))} className="w-full" />
                </div>

                <div>
                  <Small>Robôs alocados: {robotAllocation}%</Small>
                  <input type="range" min={10} max={100} value={robotAllocation} onChange={(e) => setRobotAllocation(Number(e.target.value))} className="w-full" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button onClick={handleRunSimulate} className="bg-accent text-black px-3 py-2 rounded-md font-mono shadow-sm hover:brightness-105">Simular Batch</button>
                <button onClick={() => { const sim = simulateBatch(mode, batchKg, robotAllocation); setLastSim(sim); applySimResult(sim); }} className="bg-primary px-3 py-2 rounded-md font-mono shadow-sm">Executar (Simulado)</button>
                <button onClick={() => runPreset("Day210Surge")} className="px-3 py-2 rounded-md border border-border font-mono">Preset: Day210</button>

                <div className="ml-auto flex items-center gap-2">
                  <button onClick={exportCSV} className="text-xs px-3 py-1 rounded-md border border-border font-mono">Export CSV</button>
                  <button onClick={() => runPreset("SteadyRun")} className="text-xs px-3 py-1 rounded-md border border-border font-mono">Preset: Steady</button>
                </div>
              </div>

              {/* Flow Viz */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pie */}
                <div className="col-span-1 flex flex-col items-center">
                  <div className="text-xs font-mono text-muted-foreground mb-3">Distribuição do Lote (último)</div>
                  <div className="w-44 h-44 relative">
                    <svg viewBox="0 0 100 100" className="w-44 h-44">
                      <g transform="translate(50,50)">
                        {(() => {
                          let start = 0;
                          const total = pie.total || 1;
                          return pie.slices.map((s: any) => {
                            const value = s.value || 0;
                            const angle = (value / total) * Math.PI * 2;
                            const end = start + angle;
                            const large = angle > Math.PI ? 1 : 0;
                            const x1 = Math.cos(start) * 40;
                            const y1 = Math.sin(start) * 40;
                            const x2 = Math.cos(end) * 40;
                            const y2 = Math.sin(end) * 40;
                            const d = `M 0 0 L ${x1} ${y1} A 40 40 0 ${large} 1 ${x2} ${y2} Z`;
                            const midAngle = start + angle / 2;
                            const labelX = Math.cos(midAngle) * 54;
                            const labelY = Math.sin(midAngle) * 54;
                            start = end;
                            const pct = total ? Math.round((s.value / total) * 100) : 0;
                            return (
                              <g key={s.key}>
                                <path d={d} fill={s.color} opacity={0.98} style={{ transition: "all 500ms ease" }} />
                                <text x={labelX} y={labelY} fontSize={3.6} fontFamily="monospace" fill="#e6f6ff" textAnchor={labelX < 0 ? "end" : "start"}>{pct}%</text>
                              </g>
                            );
                          });
                        })()}
                      </g>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-xs font-mono text-muted-foreground">Input</div>
                        <div className="text-lg font-mono font-bold">{lastSim ? `${lastSim.batchKg} kg` : "-"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 w-full">
                    {pie.slices && pie.slices.map((s: any) => {
                      const pct = pie.total ? Math.round((s.value / pie.total) * 100) : 0;
                      return (
                        <div key={s.key} className="flex items-center justify-between text-sm font-mono text-muted-foreground py-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
                            <span>{s.label}</span>
                          </div>
                          <div>{pct}% · {fmt(s.value || 0, 1)} kg</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Processed by type (stack) */}
                <div className="col-span-2 md:col-span-1">
                  <div className="text-xs font-mono text-muted-foreground mb-2">Processados por Tipo</div>
                  <div className="h-8 rounded-full overflow-hidden bg-border/20">
                    {(() => {
                      const p = processedPercent;
                      const plastics = Math.min(100, p * 0.5);
                      const metals = Math.min(100, p * 0.2);
                      const textiles = Math.min(100, p * 0.3);
                      const total = plastics + metals + textiles || 1;
                      const w1 = (plastics / total) * 100;
                      const w2 = (metals / total) * 100;
                      const w3 = (textiles / total) * 100;
                      return (
                        <>
                          <div style={{ width: `${w1}%` }} className="h-full inline-block bg-primary transition-all duration-700" />
                          <div style={{ width: `${w2}%` }} className="h-full inline-block bg-accent transition-all duration-700" />
                          <div style={{ width: `${w3}%` }} className="h-full inline-block bg-success transition-all duration-700" />
                        </>
                      );
                    })()}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm font-mono text-muted-foreground">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-sm" />Plásticos</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-accent rounded-sm" />Metais</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-success rounded-sm" />Têxteis</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs font-mono text-muted-foreground mb-1">Sankey (simplificado)</div>
                    <div className="h-6 rounded-full overflow-hidden bg-border/20 flex items-center">
                      <div style={{ width: `${sankey.primaryPct}%` }} className="h-full bg-accent transition-all duration-700" />
                      <div style={{ width: `${sankey.leftoverPct}%` }} className="h-full bg-muted-foreground/20 transition-all duration-700" />
                    </div>
                    <div className="flex justify-between text-sm font-mono text-muted-foreground mt-1">
                      <div>Primary: {sankey.primaryPct}%</div>
                      <div>Leftover: {sankey.leftoverPct}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Event log */}
            <section className="rounded-xl border border-accent/15 p-4 bg-panel/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-mono text-accent uppercase">Log de Eventos (últimos)</div>
                  <Small>Auditoria das ações — exporte para evidência.</Small>
                </div>
                <div>
                  <button onClick={exportCSV} className="text-xs px-2 py-1 rounded-md border border-border font-mono">Export CSV</button>
                </div>
              </div>

              <div className="mt-4 max-h-56 overflow-y-auto custom-scrollbar space-y-2">
                {events.slice(0, 12).map((e) => {
                  const style =
                    e.type === "critical"
                      ? "bg-destructive/10 text-destructive border-destructive/30 shadow"
                      : e.type === "playback"
                      ? "bg-accent/5 text-accent border-accent/25"
                      : e.type === "action"
                      ? "bg-success/5 text-success border-success/25"
                      : "bg-background/20 text-muted-foreground border-border";
                  return (
                    <div key={e.id} className={`p-3 rounded-md ${style} flex justify-between items-start`}>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground">{new Date(e.time).toLocaleTimeString()}</div>
                        <div className="text-sm font-mono mt-1">{e.source} <span className="text-xs text-muted-foreground">— {e.type}</span></div>
                        <div className="text-sm font-mono mt-1">{e.message}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{e.detail}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Modules */}
            <div className="rounded-xl border border-accent/15 p-4 bg-panel/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-mono text-accent uppercase">Status Geral do Sistema</div>
                  <Small>Visão rápida dos módulos</Small>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                {appState.modules.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-md border border-border bg-background/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background/20">
                        {m.id === "reactor" && <Zap className="h-5 w-5 text-accent" />}
                        {m.id === "power" && <BatteryCharging className="h-5 w-5 text-primary" />}
                        {m.id === "robots" && <HardHat className="h-5 w-5 text-warning" />}
                        {m.id === "isru" && <RefreshCw className="h-5 w-5 text-success" />}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground">{m.name}</div>
                        <div className="text-sm font-mono mt-0.5">{fmt(m.health, 1)}% health</div>
                      </div>
                    </div>
                    <div>
                      <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono ${m.state === "ACTIVE" ? "bg-success/10 text-success" : m.state === "DEGRADED" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{m.state}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jury summary */}
            <div className="rounded-xl border border-accent/15 p-4 bg-panel/60">
              <div className="text-sm font-mono text-accent uppercase">Resumo para jurados</div>
              <Small>3 frases diretas + exemplo</Small>

              <div className="mt-3 text-xs font-mono text-muted-foreground space-y-2">
                <div>1) Objetivo: reduzir massa enviada (ESM) reutilizando resíduos.</div>
                <div>2) Diferencial: motor de decisão que prioriza rotas de maior ΔESM.</div>
                <div>3) Métrica chave: ESM (kg-eq) — traduz economia em kg evitados no lançamento.</div>
              </div>

              <div className="mt-3 p-3 rounded-md bg-background/10 border border-border">
                <div className="text-sm font-mono font-semibold">Exemplo (100 kg, pirólise)</div>
                <div className="text-xs font-mono text-muted-foreground mt-1">Produz ≈ <strong>{fmt(pyroExample.fuel_liters || 0, 1)} L</strong> → Economia ≈ <strong>{fmt(pyroExample.delta_ESM_total, 1)} kg-eq</strong></div>
                <div className="mt-2 text-xs text-muted-foreground">(Valores demonstrativos; calibráveis com literatura)</div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-xl border border-accent/15 p-4 bg-panel/60">
              <div className="text-sm font-mono text-accent uppercase">Ações Rápidas</div>
              <Small>Intervenções de alto nível</Small>
              <div className="mt-3 space-y-2">
                <button onClick={() => { setAppState((s) => ({ ...s, kpis: { ...s.kpis, energy_kwh: s.kpis.energy_kwh + 200, efficiency_pct: Math.min(99.9, s.kpis.efficiency_pct + 1.5) } })); pushEvent("SYSTEM", "action", "Optimize Energy", "Energy +200"); }} className="w-full bg-primary text-black p-2 rounded-md font-mono">🔋 OTIMIZAR ENERGIA</button>
                <button onClick={() => { setAppState((s) => ({ ...s, kpis: { ...s.kpis, fuel_liters: s.kpis.fuel_liters + 30, energy_kwh: Math.max(0, s.kpis.energy_kwh - 50) } })); pushEvent("SYSTEM", "action", "Prioritize Fuel", "Fuel +30 L"); }} className="w-full border border-border p-2 rounded-md font-mono">⛽ PRIORIZAR COMBUSTÍVEL</button>
                <button onClick={() => { setAppState((s) => ({ ...s, kpis: { ...s.kpis, parts_kg: s.kpis.parts_kg + 12, materials_processed_kg: Math.min(s.kpis.materials_total_kg, s.kpis.materials_processed_kg + 12) } })); pushEvent("SYSTEM", "action", "Produce Parts", "12 kg parts"); }} className="w-full bg-accent text-black p-2 rounded-md font-mono">🧱 PRODUZIR PEÇAS</button>
              </div>
            </div>

            {/* Mission params */}
            <div className="rounded-xl border border-accent/15 p-4 bg-panel/60">
              <div className="text-sm font-mono text-accent uppercase">Parâmetros da Missão</div>
              <Small>Configurações rápidas</Small>
              <div className="mt-3 text-xs font-mono text-muted-foreground space-y-2">
                <div>Target efficiency: 85%</div>
                <div>Current efficiency: {fmt(appState.kpis.efficiency_pct, 1)}%</div>
                <div>Days remaining: 203</div>
                <div>CO₂ converted: {fmt((appState.kpis.co2ConvertedKg || 890), 0)} kg</div>
              </div>
            </div>
          </aside>
        </div>

        {/* Decision modal */}
        {showModal && lastSim && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6">
            <div className="w-full max-w-2xl bg-panel/80 border border-border rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-mono text-xl font-bold">Decision Simulation</h4>
                  <Small>Resumo em destaque — clique Cálculo para ver fórmulas</Small>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Badge tone="muted">Confiança: {fmt(lastSim.confidence * 100, 0)}%</Badge>
                  <div>{new Date().toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowCalc(false)} className={`px-3 py-1 rounded-md font-mono ${!showCalc ? "bg-accent text-black" : "border border-border"}`}>Resumo</button>
                  <button onClick={() => setShowCalc(true)} className={`px-3 py-1 rounded-md font-mono ${showCalc ? "bg-accent text-black" : "border border-border"}`}>Cálculo</button>
                </div>

                {!showCalc ? (
                  <div className="mt-4 p-4 rounded-md bg-background/10 border border-border">
                    <div className="text-sm font-mono">Resumo</div>
                    <div className="text-2xl font-mono font-bold mt-2">{lastSim.mode.toUpperCase()} · {lastSim.batchKg} kg</div>
                    <div className="mt-2 text-[15px] font-mono">
                      Estimado: <strong>{fmt(lastSim.fuel_liters || 0, 1)} L</strong> combustível<br />
                      Economia logística: <strong>{fmt(lastSim.delta_ESM_total, 2)} kg-eq</strong>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Observação: valores demonstrativos — calibráveis com literatura técnica.</div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 rounded-md bg-background/10 border border-border font-mono text-xs space-y-1">
                    <div><strong>Batch:</strong> {lastSim.batchKg} kg</div>
                    <div><strong>Process energy (kWh):</strong> {fmt(lastSim.process_energy_kwh || 0, 1)}</div>
                    <div><strong>Fuel mass (kg):</strong> {fmt(lastSim.fuel_mass_kg || 0, 2)}</div>
                    <div><strong>Fuel energy (kWh):</strong> {fmt(lastSim.fuel_energy_kwh || 0, 1)}</div>
                    <div><strong>Net energy (kWh):</strong> {fmt(lastSim.net_energy_kwh || 1)}</div>
                    <div><strong>ΔESM from energy (kg-eq):</strong> {fmt(lastSim.delta_ESM_breakdown.from_energy, 2)}</div>
                    <div><strong>ΔESM from primary (kg-eq):</strong> {fmt(lastSim.delta_ESM_breakdown.from_primary, 2)}</div>
                    <div className="mt-2 text-[12px]">Formulas: fuel_mass = batch * 0.60 · fuel_energy = fuel_mass * 15.4 * 0.92 · process_energy = batch * 2.1 · ΔESM_energy = netEnergy * 0.04</div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-3 py-2 rounded-md border border-border font-mono">Cancelar</button>
                <button onClick={handleConfirmApply} className="px-3 py-2 rounded-md bg-primary text-black font-mono">Confirmar e Aplicar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
