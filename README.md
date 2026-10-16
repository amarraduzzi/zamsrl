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

Inloggen gaat zonder GitHub-account:
1. Klant opent `https://zamsrl.pages.dev/admin` (zamsrl.be/admin stuurt daarheen door).
2. Cloudflare Access vraagt zijn e-mail en stuurt een code van 6 cijfers.
3. `/api/token` controleert de Access-login en geeft het CMS de GitHub-sleutel. Het CMS logt automatisch in.
4. Na Publiceren wordt de site automatisch opnieuw uitgerold (ongeveer 1 minuut).

Teksten in `content/texts.json` overschrijven de standaardteksten in het `T`-object in `index.html`. Een leeg veld valt terug op de standaardtekst. Nieuwe tekstvelden toevoegen: key in `T`, in `content/texts.json` en in `admin/config.yml`.

### Eenmalige installatie
- **GitHub**: fine-grained token, alleen repo `amarraduzzi/zamsrl`, permissie Contents: Read and write.
- **Cloudflare Zero Trust > Access > Applications**: self-hosted app op `zamsrl.pages.dev` met paden `admin` en `api/token`, policy Allow op de e-mailadressen van de klant en Amplify, login via One-time PIN.
- **Cloudflare Pages > zamsrl > Settings > Variables and Secrets**: `GITHUB_TOKEN` (secret), `ACCESS_TEAM` (teamnaam), `ACCESS_AUD` (Application Audience tag van de Access-app). Daarna opnieuw deployen.
- Lokaal testen: `python3 -m http.server` (panden en teksten worden via `fetch` geladen).

## Deploy
Werkt direct op Cloudflare Pages, Netlify of GitHub Pages: geen build-stap nodig.
