# Nu în numele meu / Not In My Name

## Cauza (RO)

### De ce există această campanie

În România, persoane reale ajung să suporte consecințe juridice și financiare pentru credite online făcute de altcineva cu date de identitate furate.

Problema principală: în multe fluxuri de creditare la distanță, verificarea identității nu este suficient de robustă înainte de acordarea creditului, iar victima trebuie apoi să dovedească faptul că nu a consimțit.

Campania „Nu în numele meu” cere reguli clare și aplicabile:
- verificare tehnică reală a identității înainte de acordarea banilor
- legătură explicită între verificare și validitatea/executorialitatea contractului
- suspendarea temporară a executării când există sesizare serioasă de fraudă de identitate
- păstrarea probelor tehnice de identificare pentru audit și control

Acest site centralizează explicația publică, resursele legale, contextul european și modelele de petiții.

## Cause (EN)

### Why this campaign exists

In Romania, real people can face legal and financial consequences for remote loans contracted by someone else using stolen identity data.

Core issue: in many digital lending flows, identity verification is not robust enough before disbursement, while the victim later carries the burden of proving lack of consent.

The “Not In My Name” campaign asks for clear and enforceable safeguards:
- real technical identity verification before any disbursement
- explicit legal link between verification and enforceability of the contract
- temporary suspension of enforcement when there is a substantiated identity-fraud complaint
- retention of technical verification evidence for audit and oversight

This website provides the public explanation, legal basis, EU context, and complaint templates.

## Ce include proiectul

- homepage RO și EN
- pagină de petiție RO și EN
- pagină de resurse RO și EN
- SEO on-page: meta title, description, canonical, hreflang, Open Graph, Twitter cards, JSON-LD, sitemap, robots
- active de branding: favicon, PWA manifest, imagini Open Graph
- optimizări de livrare: output minificat, fișiere `.gz` și `.br`, cache headers pentru Cloudflare Pages

## Configurare rapidă

Variabile de mediu folosite la build:

- `SITE_URL` - domeniul final, ex: `https://nuinnumelemeu.ro`
- `GA_MEASUREMENT_ID` - opțional, ID Google Analytics (ex: `G-XXXXXXXXXX`)
- `BASE_PATH` - gol pentru root/domain propriu; `/<repo-name>` pentru GitHub Pages pe subpath
- `SIGN_URL` - opțional, link extern de semnare


## Referințe comenzi Docker

Preview local complet (build + serve):

```bash
docker compose up --build
```

Cu variabile custom:

```bash
SITE_URL=https://nuinnumelemeu.ro GA_MEASUREMENT_ID= BASE_PATH= SIGN_URL= docker compose up --build
```

Export doar `dist` (fără preview):

```bash
docker compose run --rm dist-export
```

URL preview local: `http://localhost:4321`
