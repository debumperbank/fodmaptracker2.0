# Fodmap Tracker 2.0 — MVP

Mobile-first Nederlandse webapp voor het registreren van voeding en symptomen. De app bevat accounts, een persoonlijk dashboard, voedings- en symptoomregistraties, persoonlijke recepten en een weekmenu. Het Supabase-schema gebruikt Row Level Security (RLS).

## Wat zit erin?

- Next.js App Router + TypeScript
- Supabase Auth via `@supabase/ssr`
- Server actions met Zod-validatie
- PostgreSQL-tabellen voor profielen, voedingsregistraties, symptoomregistraties en toekomstige gecontroleerde voedingsdata
- RLS: gebruikers kunnen uitsluitend hun eigen registraties lezen en wijzigen
- Responsive UI voor mobiel en desktop
- Persoonlijke recepten zoeken, bekijken, aanmaken en verwijderen
- Recepten per dag en eetmoment in een weekmenu plannen
- Maaltijden en klachten bewerken, aan elkaar koppelen en van vrije notities voorzien
- Privéfoto's bij maaltijden via een afgeschermde Supabase Storage-bucket
- Geen demo-gezondheidsdata en geen automatisch verzonnen FODMAP-classificaties

## Vereisten

- Node.js 20.9 of nieuwer (gebruik bij voorkeur een actuele LTS-versie die door de gekozen Next.js-versie wordt ondersteund)
- Een Supabase-project

## Lokaal starten

1. Pak het project uit.
2. Maak een Supabase-project aan.
3. Open **SQL Editor** in Supabase en voer de migraties in `supabase/migrations` op volgorde uit (`0001` t/m `0005`).
4. Kopieer `.env.example` naar `.env.local`.
5. Vul `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` en `SITE_URL=http://localhost:3000` in vanuit je Supabase-project.
6. Voeg in Supabase Auth → URL Configuration `http://localhost:3000/auth/callback` toe aan de toegestane redirect URLs.
7. Voer uit:

```bash
npm install
npm run dev
```

8. Open `http://localhost:3000`, maak een account aan en bevestig je e-mailadres als e-mailbevestiging in Supabase aanstaat.

## Productie

- Zet de app op Vercel of een vergelijkbaar platform.
- Stel dezelfde environment variables in met de productie-URL.
- Voeg de productie callback URL toe aan Supabase Auth.
- Voer `npm run typecheck` en `npm run build` uit in CI voordat je deployt.
- Configureer Supabase-back-ups, e-mailbevestiging, rate limiting en monitoring.
- Zet nooit een Supabase `service_role`/secret key in `NEXT_PUBLIC_*` of clientcode.

## Scope en bewuste beperkingen

Dit is een MVP-startpunt, geen medisch gevalideerd product of volledig afgeronde productieapp. Voedingsregistraties en symptoomregistraties kunnen achteraf worden bewerkt en aan elkaar gekoppeld. Export, accountverwijdering, privacyverklaring, consent flows, betalingen en AI zijn nog niet geïmplementeerd. Recepten zijn persoonlijke invoer en krijgen geen automatische FODMAP-classificatie. De ernstschuif legt de gekozen waarde op in het formulier en toont de huidige waarde.

De tabellen `food_catalog` en `food_fodmap_assessments` zijn alleen een datamodel voor latere gecontroleerde gegevens. Er zijn bewust geen FODMAP-scores ingevuld. Gebruik voor FODMAP-beoordelingen alleen rechtmatig verkregen, betrouwbare gegevens en laat de inhoud deskundig controleren. De app mag geen diagnose stellen of dieetbehandeling voorschrijven.

Omdat symptomen gezondheidsgegevens kunnen zijn, voer vóór een openbare lancering een AVG/privacybeoordeling uit: rechtsgrond, transparantie, bewaartermijnen, dataminimalisatie, rechten van betrokkenen, verwerkersovereenkomsten en beoordelen of een DPIA nodig is.
