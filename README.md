# Fodmap Tracker 2.0 — MVP

Mobile-first Nederlandse webapp voor het registreren van voeding en symptomen. Deze codebasis bevat accounts, een persoonlijk dashboard, toevoegen/verwijderen van voedingsregistraties en een Supabase-schema met Row Level Security (RLS).

## Wat zit erin?

- Next.js App Router + TypeScript
- Supabase Auth via `@supabase/ssr`
- Server actions met Zod-validatie
- PostgreSQL-tabellen voor profielen, voedingsregistraties, symptoomregistraties en toekomstige gecontroleerde voedingsdata
- RLS: gebruikers kunnen uitsluitend hun eigen registraties lezen en wijzigen
- Responsive UI voor mobiel en desktop
- Geen demo-gezondheidsdata en geen automatisch verzonnen FODMAP-classificaties

## Vereisten

- Node.js 20.9 of nieuwer (gebruik bij voorkeur een actuele LTS-versie die door de gekozen Next.js-versie wordt ondersteund)
- Een Supabase-project

## Lokaal starten

1. Pak het project uit.
2. Maak een Supabase-project aan.
3. Open **SQL Editor** in Supabase en voer de migraties in volgorde uit: `0001_initial_schema.sql`, `0002_admin_dashboard.sql` en `0003_security_hardening.sql`.
4. Kopieer `.env.example` naar `.env.local`.
5. Vul `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` en `SITE_URL=http://localhost:3000` in vanuit je project en lokale URL.
6. Voeg in Supabase Auth → URL Configuration `http://localhost:3000/auth/callback` toe aan de toegestane redirect URLs.
7. Voer uit:

```bash
npm install
npm run dev
```

8. Open `http://localhost:3000`, maak een account aan en bevestig je e-mailadres als e-mailbevestiging in Supabase aanstaat.

## Productie

- Zet de app op Vercel of een vergelijkbaar platform.
- Stel `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` en `SITE_URL` als server-only environment variables in.
- Voeg de productie callback URL toe aan Supabase Auth.
- De CI-workflow controleert op bekende geheimspatronen, kwetsbare dependencies, TypeScript-fouten en buildfouten.
- Configureer Supabase-back-ups, e-mailbevestiging, rate limiting en monitoring.
- Zet nooit een Supabase `service_role`- of secret key in `NEXT_PUBLIC_*`, clientcode of Git.

De publishable key is volgens Supabase ontworpen voor gebruik in clienttoepassingen en is op zichzelf geen geheim. Deze app gebruikt de key alleen in server-side code, zodat de configuratie niet onnodig in browserbundels terechtkomt. De databasebeveiliging blijft afhankelijk van RLS en correcte databasebevoegdheden.

## Scope en bewuste beperkingen

Dit is een MVP-startpunt, geen medisch gevalideerd product of volledig afgeronde productieapp. Voedingsregistraties en symptoomregistraties worden bij het aanmaken op de huidige serverdatum opgeslagen; bewerken, handmatige datum/tijd, export, accountverwijdering, privacyverklaring, consent flows, betalingen en AI zijn nog niet geïmplementeerd. De ernstschuif legt de gekozen waarde op in het formulier, maar de UI heeft in deze versie nog geen live numerieke indicator.

De tabellen `food_catalog` en `food_fodmap_assessments` zijn alleen een datamodel voor latere gecontroleerde gegevens. Er zijn bewust geen FODMAP-scores ingevuld. Gebruik voor FODMAP-beoordelingen alleen rechtmatig verkregen, betrouwbare gegevens en laat de inhoud deskundig controleren. De app mag geen diagnose stellen of dieetbehandeling voorschrijven.

Omdat symptomen gezondheidsgegevens kunnen zijn, voer vóór een openbare lancering een AVG/privacybeoordeling uit: rechtsgrond, transparantie, bewaartermijnen, dataminimalisatie, rechten van betrokkenen, verwerkersovereenkomsten en beoordelen of een DPIA nodig is.
