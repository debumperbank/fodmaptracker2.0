import { isHalloweenToday } from "@/lib/seasonal";

export default function Loading() {
  const halloween=isHalloweenToday();
  return (
    <main className="startup-screen" aria-label="Fodmap-Tracker wordt geladen">
      <img src={halloween?"/halloween/pumpkin-logo.webp":"/logo-emblem.png"} alt="" width="112" height="112" />
      <div className="startup-wordmark">Fodmap-Tracker<span className="startup-dot">.</span></div>
      <p>Even je overzicht laden…</p>
    </main>
  );
}
