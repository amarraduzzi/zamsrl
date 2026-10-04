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
- Echte panden toevoegen via `/admin`; de 6 huidige panden zijn voorbeelden (veld "Bien d'exemple" aan).
- Contactformulier koppelen (bijv. Formspree of Cloudflare Pages Functions).
- Bevestigen dat de copy klopt met de activiteit van ZAM (eigen vastgoed kopen/verkopen/verhuren, geen makelaardij zonder BIV/IPI-erkenning).

## Beheer door de eigenaar (CMS)
1. Open `https://www.zamsrl.be/admin` en log in met GitHub (account moet schrijfrechten hebben op deze repo).
2. Pand toevoegen, wijzigen of verwijderen en op Publiceren klikken. De site wordt automatisch opnieuw uitgerold (ongeveer 1 minuut).
3. Foto's uploaden gaat in hetzelfde scherm; ze komen in `assets/img/uploads/`.

### Eenmalige installatie
- GitHub > Settings > Developer settings > OAuth Apps > New. Homepage URL `https://www.zamsrl.be`, callback URL `https://www.zamsrl.be/api/callback`.
- Cloudflare Pages > het project > Settings > Variables and Secrets: `GITHUB_CLIENT_ID` en `GITHUB_CLIENT_SECRET` (secret) toevoegen en opnieuw deployen.
- Lokaal testen kan niet via dubbelklikken op `index.html`; gebruik `python3 -m http.server` (de panden worden via `fetch` geladen).

## Deploy
Werkt direct op Cloudflare Pages, Netlify of GitHub Pages: geen build-stap nodig.
