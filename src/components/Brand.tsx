import { isHalloweenToday } from "@/lib/seasonal";

export function Brand() { const halloween=isHalloweenToday();return <a className="brand" href="/dashboard" aria-label="Tolerio home"><img src={halloween?"/halloween/pumpkin-logo.webp":"/logo-emblem.png"} alt="" width="38" height="38"/><span className="brand-wordmark">Tolerio<span className="brand-dot">.</span></span></a>; }
