import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/data";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Beheer en stabiliteit" };

type RecentSignup = { created_at: string };
type AdminStats = {
  generated_at: string;
  database_status: string;
  total_auth_users: number;
  total_profiles: number;
  profiles_last_24h: number;
  profiles_last_7d: number;
  auth_users_without_profile: number;
  total_food_entries: number;
  food_entries_last_7d: number;
  total_symptom_entries: number;
  symptom_entries_last_7d: number;
  latest_profile_created_at: string | null;
  recent_signups: RecentSignup[];
};

const number = (value: number) => value.toLocaleString("nl-NL");
const dateTime = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("nl-NL", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Amsterdam",
      }).format(new Date(value))
    : "Nog geen registraties";

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="card stat">
      <div className="subtle" style={{ fontSize: 12 }}>{label}</div>
      <div className="stat-number">{value}</div>
      <div className="subtle" style={{ fontSize: 12 }}>{detail}</div>
    </div>
  );
}

export default async function AdminPage() {
  const { supabase, user } = await requireUser();

  const { data: isAdmin, error: adminCheckError } = await supabase.rpc("is_app_admin");
  if (adminCheckError || isAdmin !== true) redirect("/dashboard");

  const { data, error } = await supabase.rpc("get_admin_dashboard_stats");
  if (error || !data) {
    return (
      <AppShell active="admin" email={user.email ?? "Beheerder"}>
        <section className="card">
          <div className="eyebrow">Beheer</div>
          <h1 className="page-title">Stabiliteitsdashboard</h1>
          <div className="notice notice-error">
            De statistieken konden niet worden geladen. Controleer de Supabase-migratie en de databaseverbinding.
          </div>
          <p className="subtle">Er zijn geen beheerstatistieken getoond.</p>
          <Link className="btn btn-secondary" href="/dashboard">Terug naar overzicht</Link>
        </section>
      </AppShell>
    );
  }

  const stats = data as AdminStats;
  const profileMismatch = stats.auth_users_without_profile > 0;

  return (
    <AppShell active="admin" email={user.email ?? "Beheerder"}>
      <section className="welcome">
        <div className="eyebrow">Alleen voor beheer</div>
        <h1 className="page-title" style={{ marginTop: 10 }}>Stabiliteitsdashboard</h1>
        <p className="subtle" style={{ maxWidth: 680 }}>
          Een compact overzicht van accountgroei, opgeslagen registraties en de bereikbaarheid van de database.
          Alleen accounts die als beheerder zijn ingesteld, kunnen deze statistieken opvragen.
        </p>
        <p className="subtle" style={{ fontSize: 12, marginBottom: 0 }}>
          Laatst bijgewerkt: {dateTime(stats.generated_at)}
        </p>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 className="section-title" style={{ marginBottom: 10 }}>Accounts</h2>
        <div className="stat-grid">
          <Metric label="Geregistreerde accounts" value={number(stats.total_auth_users)} detail="Totaal in Supabase Auth" />
          <Metric label="Aangemaakte profielen" value={number(stats.total_profiles)} detail="De profielenteller" />
          <Metric label="Nieuwe accounts · 24 uur" value={number(stats.profiles_last_24h)} detail="Op basis van profieldatum" />
        </div>
        <div className="stat-grid" style={{ marginTop: 12 }}>
          <Metric label="Nieuwe profielen · 7 dagen" value={number(stats.profiles_last_7d)} detail="Recente groei" />
          <Metric label="Maaltijdregistraties" value={number(stats.total_food_entries)} detail={number(stats.food_entries_last_7d) + " in de afgelopen 7 dagen"} />
          <Metric label="Klachtenregistraties" value={number(stats.total_symptom_entries)} detail={number(stats.symptom_entries_last_7d) + " in de afgelopen 7 dagen"} />
        </div>
      </section>

      <section className="grid-main" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="section-title">Systeemcontroles</h2>
          <div className="entry">
            <div>
              <div className="entry-title">Supabase-database</div>
              <div className="subtle" style={{ fontSize: 12 }}>Statistieken konden via de database worden opgehaald</div>
            </div>
            <span className="pill">Verbonden</span>
          </div>
          <div className="entry">
            <div>
              <div className="entry-title">Account- en profielcontrole</div>
              <div className="subtle" style={{ fontSize: 12 }}>
                {profileMismatch
                  ? number(stats.auth_users_without_profile) + " account(s) zonder profiel"
                  : "Alle geregistreerde accounts hebben een profiel"}
              </div>
            </div>
            <span className="pill" style={profileMismatch ? { background: "#fff0ed", color: "#9a3b31" } : undefined}>
              {profileMismatch ? "Controleren" : "OK"}
            </span>
          </div>
          <div className="entry">
            <div>
              <div className="entry-title">Laatste profielregistratie</div>
              <div className="subtle" style={{ fontSize: 12 }}>Meest recente profiel in de database</div>
            </div>
            <span style={{ fontSize: 12, textAlign: "right" }}>{dateTime(stats.latest_profile_created_at)}</span>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Recente aanmeldingen</h2>
          {stats.recent_signups.length === 0 ? (
            <div className="empty">Er zijn nog geen profielen geregistreerd.</div>
          ) : (
            stats.recent_signups.map((signup, index) => (
              <div className="entry" key={signup.created_at + index}>
                <div>
                  <div className="entry-title">Account aangemaakt</div>
                  <div className="subtle" style={{ fontSize: 12 }}>Registratie {index + 1} in de recente lijst</div>
                </div>
                <span style={{ fontSize: 12, textAlign: "right" }}>{dateTime(signup.created_at)}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <h2 className="section-title">Monitoring: volgende stap</h2>
        <p className="subtle" style={{ marginBottom: 8 }}>
          Dit dashboard controleert de database en de belangrijkste aantallen. Het verzamelt nog geen frontend-fouten,
          serverfouten of responstijden. Daarvoor moeten we later foutmonitoring en Vercel-runtimegegevens koppelen.
        </p>
        <p className="subtle" style={{ fontSize: 12, marginBottom: 0 }}>
          Gezondheidsgegevens worden niet getoond in dit overzicht; alleen totalen en registratiedata.
        </p>
      </section>
    </AppShell>
  );
}
