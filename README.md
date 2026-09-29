# ZAM SRL website

Statische website voor ZAM SRL (Genappe, BE 0477.597.415). Frans als standaardtaal, met Nederlands en Engels via de taalknop.

## Structuur
- `index.html`: volledige site (HTML, CSS en JS in één bestand). Alle teksten staan in het `T`-object onderaan, per taal (`fr`, `nl`, `en`).
- `assets/img/`: foto's en favicon.

## Taal via link
`index.html#nl` of `index.html#en` opent direct in die taal.

## Nog te doen voor livegang
- Echt e-mailadres invullen (nu placeholder).
- Echte foto's en panden toevoegen (array `PROPS` in `index.html`; huidige panden zijn voorbeelden).
- Contactformulier koppelen (bijv. Formspree of Cloudflare Pages Functions).
- Bevestigen dat de copy klopt met de activiteit van ZAM (eigen vastgoed kopen/verkopen/verhuren, geen makelaardij zonder BIV/IPI-erkenning).

## Deploy
Werkt direct op Cloudflare Pages, Netlify of GitHub Pages: geen build-stap nodig.
