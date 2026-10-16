# ZAM SRL website

Statische website voor ZAM SRL (Genappe, BE 0477.597.415). Frans als standaardtaal, met Nederlands en Engels via de taalknop.

## Structuur
- `index.html`: volledige site (HTML, CSS en JS in één bestand). Alle teksten staan in het `T`-object onderaan, per taal (`fr`, `nl`, `en`).
- `content/properties.json`: alle panden. Wordt beheerd via `/admin` (of met de hand te bewerken).
- `admin/`: beheerscherm (Sveltia CMS) voor de eigenaar, bereikbaar op `/admin`.
- `functions/api/`: GitHub-login voor het beheerscherm (Cloudflare Pages Functions).
- `assets/img/`: foto's en favicon.

## Taal via link
`index.html#nl` of `index.html#en` opent direct in die taal.

## Nog te doen voor livegang
- Echt e-mailadres invullen (nu placeholder).
- Echte panden toevoegen via `/admin`; de 6 huidige panden zijn voorbeelden (veld "Bien d'exemple" aan). Tekst "Nos biens" vermeldt nog dat het voorbeelden zijn.
- Contactformulier koppelen (bijv. Formspree of Cloudflare Pages Functions).
- Bevestigen dat de copy klopt met de activiteit van ZAM (eigen vastgoed kopen/verkopen/verhuren, geen makelaardij zonder BIV/IPI-erkenning).

## Beheer door de eigenaar (CMS)
De klant beheert **panden** (`content/properties.json`) en **teksten** (`content/texts.json`, FR/NL/EN) via `/admin`. Layout en design blijven bij Amplify.

Inloggen gaat zonder GitHub-account, met één wachtwoord:
1. Klant opent `https://zamsrl.pages.dev/admin` (of zamsrl.be/admin zodra het domein naar Cloudflare wijst).
2. Wachtwoord invullen. `/api/login` zet een beveiligde cookie (30 dagen geldig).
3. `/api/token` controleert die cookie en geeft het CMS de GitHub-sleutel. Het CMS logt automatisch in.
4. Na Publiceren wordt de site automatisch opnieuw uitgerold (ongeveer 1 minuut).

Teksten in `content/texts.json` overschrijven de standaardteksten in het `T`-object in `index.html`. Een leeg veld valt terug op de standaardtekst. Nieuwe tekstvelden toevoegen: key in `T`, in `content/texts.json` en in `admin/config.yml`.

### Eenmalige installatie
- **GitHub**: fine-grained token, alleen repo `amarraduzzi/zamsrl`, permissie Contents: Read and write.
- **Cloudflare Pages > zamsrl > Settings > Variables and Secrets** (type Secret): `GITHUB_TOKEN` en `ADMIN_PASSWORD`. Daarna opnieuw deployen.
- Wachtwoord wijzigen: `ADMIN_PASSWORD` aanpassen en opnieuw deployen. Alle bestaande logins vervallen dan.
- Lokaal testen: `python3 -m http.server` voor de site, `npx wrangler pages dev .` met een `.dev.vars` voor het beheerscherm.

## Deploy
Werkt direct op Cloudflare Pages, Netlify of GitHub Pages: geen build-stap nodig.
