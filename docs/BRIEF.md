# Prompt voor Claude Code: website Naitvision

Plak alles hieronder in Claude Code in een lege repo. Laat Claude Code dit bestand ook bewaren als `docs/BRIEF.md`, zodat het er in latere sessies naar kan teruggrijpen.

## 0. Jouw rol en hoe je werkt

Je bouwt de nieuwe website van Naitvision, een foto- en videobedrijf uit Limburg (België). Neem je tijd en lever kwaliteit: dit moet aanvoelen als een premium creatief bureau, niet als een template.

Werkwijze:

1. Lees deze brief volledig. Stel eerst een kort plan voor (stack, mappenstructuur, volgorde van secties) en wacht op mijn akkoord.
2. Bouw sectie per sectie. Na elke sectie: dev-server draaien, screenshots maken met Playwright op 375px, 768px en 1440px breed, zelf kritisch bekijken en verbeteren. Daarna pas committen.
3. Je kan de referentiesites zelf niet openen (ze blokkeren bots). De beschrijving hieronder is je referentie. Volg ze nauwkeurig.
4. Verzin nooit cijfers, klantnamen, logo's of testimonials. Alles tussen `[INVULLEN: ...]` laat je zichtbaar als placeholder staan tot ik het aanlever. Ontbrekende beelden = neutrale grijze vlakken met label (bv. "REEL 9:16"), nooit stockfoto's.
5. Alle teksten staan in één bestand (`src/content/site.ts` of JSON), zodat ik copy kan aanpassen zonder componenten aan te raken.
6. Als je een frontend-design-skill hebt, gebruik die.

## 1. Stack en hosting

* Astro (statische output), TypeScript, Tailwind CSS (of vanilla CSS met custom properties, jouw keuze, maar consequent).
* Animaties: GSAP + ScrollTrigger en Lenis voor smooth scroll. Alles respecteert `prefers-reduced-motion` (dan: geen smooth scroll, geen parallax, enkel fades).
* Hosting: Cloudflare Pages, gekoppeld aan de GitHub-repo. Build `npm run build`, output `dist`.
* Contactformulier: Cloudflare Pages Function (`functions/api/contact.ts`) die mailt via Resend (API-key als environment variable), met Cloudflare Turnstile tegen spam. Geef me exacte stappen om dit in het Cloudflare-dashboard in te stellen.
* Analytics: Cloudflare Web Analytics (cookieloos → geen cookiebanner nodig). Geen Google Analytics, geen trackers.
* Fonts self-hosted (woff2 in `/public/fonts`), niet via de Google Fonts-CDN (GDPR).
* Domein: `[INVULLEN: domein, bv. naitvision.be]`.

## 2. Over Naitvision (context voor copy en keuzes)

* Foto- en videoproductie, opgericht in 2022, gerund door twee broers. Altijd "wij/we", nooit "ik".
* Gevestigd in Limburg, België. Doelgroep: lokale ondernemers en KMO's, sectoroverschrijdend (horeca, wellness, retail, bouw, events...). Niet enkel sport.
* Kernaanbod: maandelijkse short-form content (Reels, TikTok, Shorts) met een vaste shootdag per maand. Doel = terugkerende klanten (retainers).
* Bijkomend: fotografie, video & aftermovies, 360° virtuele tours (Matterport), livestreams van events.
* Sportwerk (profvoetballers, voetbalinfluencers) is bewijs van niveau, niet de niche. Gebruik het als proof, niet als positionering.
* Merknaam: "Nait" is de familienaam en klinkt als "knight". Logo = schaakpaard met een lensdiafragma in de manen. Daar haken we op in met een subtiel schaakthema (zie slot-CTA "JOUW ZET.").
* Toon: kort, direct, zelfverzekerd, geen marketingjargon, geen beloftes over gegarandeerd bereik, geen beloftes over levertermijnen.

## 3. Visuele richting (gebaseerd op nxtsport.de, mijn favoriet)

### Sfeer

Donker, monochroom, filmisch. Veel zwart, grote uppercase typografie, veel ademruimte, beweging die rustig en strak aanvoelt. Het werk (video) is de held, de interface blijft sober.

### Kleuren (als CSS-variabelen, makkelijk aanpasbaar)

* `--bg`: #0A0A0A (bijna zwart)
* `--surface`: #141414 (kaarten, panelen)
* `--text`: #F1F0EA (warm off-white, zoals nxtsport)
* `--muted`: #8A8A85
* `--line`: rgba(241,240,234,0.15) (dunne scheidingslijnen)
* `--accent`: #C9A227 (goud uit onze huisstijl). Spaarzaam: hover op CTA's, kleine labels, focus states. Nooit grote vlakken.

### Typografie

* Display (titels): brede, geometrische, wat hoekige sans in UPPERCASE, licht negatieve letterspacing. nxtsport gebruikt "Bank Sans" (betalend). Test deze gratis alternatieven naast elkaar en kies de beste, motiveer kort: Michroma, Tomorrow (600/700), Unbounded. Eén CSS-variabele `--font-display`.
* Condensed (marquees, kleine labels): Big Shoulders Display 700 of Barlow Condensed 600, uppercase.
* Body: Inter 400/500, 16 tot 18px, ruime regelhoogte.
* Schaal referentie op 1440px: sectietitels ±70px, hero-woorden ±56px, procesnummers ±200px+. Fluid met `clamp()`.

### Beweging

* Smooth scroll (Lenis).
* Titels en tekstblokken: subtiele reveal bij scrollen (fade + kleine translateY, of line-mask reveal).
* Oneindige marquees (CSS of GSAP), pauzeren bij hover.
* Video's: muted, loop, playsinline, enkel afspelen wanneer in beeld (IntersectionObserver), anders pauzeren.
* Niets springerigs. Easing: zacht (bv. `power3.out`), duur 0.6 tot 1s.

## 4. Paginastructuur

Pagina's: Home (lange one-pager), /werk (portfolio), /contact, /privacy, 404.
Taal: Nederlands (`lang="nl-BE"`). Zet de structuur i18n-klaar op (EN later), maar bouw nu alleen NL.

### 4.1 Header

* Links: logo (SVG, `[INVULLEN: logo.svg]`) + woordmerk NAITVISION.
* Rechts: kleine uppercase links gestapeld onder elkaar (zoals nxtsport): DIENSTEN / WERK / CONTACT. Plus één knop "Plan een gesprek" (pill, dunne rand, hover → goud).
* Transparant boven de hero, wordt bij scrollen een subtiele donkere balk (blur). Verbergt zich bij naar beneden scrollen, verschijnt bij omhoog scrollen.
* Mobiel: hamburger → fullscreen zwart menu met grote display-links, gestaggerd ingeanimeerd.

### 4.2 Hero (volledig scherm)

* Zwarte achtergrond met een groot, half transparant schaakpaard-logo als watermerk achter de tekst (zoals de grote N7 bij nxtsport). Optie B om te testen: een donkere, gedimde achtergrondvideo (showreel, opacity ±0.35) met het watermerk erover. Bouw A, maak B schakelbaar via een prop.
* Centraal, horizontaal verspreid, groot en uppercase: CONTENT · FOTO · VIDEO (drie woorden, licht gestaggerd ingeanimeerd).
* Daaronder kleiner, als echte H1 voor SEO: "Short-form content en beeld voor lokale ondernemers in Limburg."
* Onderaan: klein scroll-icoontje (muis-outline met bewegend puntje) + "SCROLL".
* Rechts verticaal, vast: ronde social icons (Instagram, TikTok, LinkedIn: `[INVULLEN: welke kanalen]`).

### 4.3 Marquee-band

Eindeloze band, condensed uppercase, gescheiden door een klein goud puntje: REELS · TIKTOK · YOUTUBE SHORTS · FOTOGRAFIE · AFTERMOVIES · EVENTS · 360° TOURS · LIVESTREAMS. Optioneel tweede rij in tegengestelde richting, in `--muted`.

### 4.4 Intro + reel-carousel (de "IGNITE POTENTIAL"-sectie van nxtsport)

* Bovenaan een rij in twee kolommen: links een enorme titel over twee regels "ZICHTBAAR / BLIJVEN", rechts een korte alinea: "Je zaak draait. Je socials niet altijd. Wij komen één dag per maand langs, filmen en fotograferen, en leveren content af die klaar is om te posten. Jij focust op je zaak."
* Daaronder dunne lijn over de volle breedte.
* Daaronder de reel-carousel: verticale 9:16 videokaarten. De middelste kaart staat recht en is groot, de kaarten links en rechts zijn kleiner, gekanteld (rotate ±8°) en schuin in perspectief en lopen deels uit beeld. Onder de middelste kaart een klein uppercase label met klant/project. Swipe/drag op mobiel, pijlen of drag op desktop, automatisch doorschuiven elke ±5s.
* Content: `[INVULLEN: 6–8 reels, 9:16, met klantnaam]`.

### 4.5 Klantenband

* "WIJ WERKTEN VOOR" als klein label, daaronder een marquee van klantnamen/logo's in grijs, hover → wit.
* Enkel echte klanten die toestemming gaven. Geen merken waarvoor we niet rechtstreeks werkten (bv. bij de shoot in Zwitserland was de klant de influencer, niet het horlogemerk). `[INVULLEN: lijst + logo's]`.

### 4.6 Impact (de "LASTING IMPACT"-sectie)

* Zelfde twee-kolomlayout: titel "BEELD DAT / WERKT" links, korte alinea rechts.
* Drie cijfers in grote display-font met count-up animatie, kleine label eronder:
  * `[INVULLEN: 120M+]` views voor klanten
  * `[INVULLEN: aantal]` projecten
  * Sinds 2022
* Daaronder een grid van 3 brede beelden/video's (16:9), lichte parallax.

### 4.7 Aanpak (de "THE PROCESS"-sectie)

* Titel "ONZE / AANPAK" links, alinea rechts.
* Vier kolommen met gigantische cijfers 1 2 3 4 in display-font, kleur `--muted`/grijs, die bij in beeld scrollen van onder naar boven in beeld schuiven (mask reveal). Daaronder titel (Inter, ±32px) en korte tekst:
  1. Kennismaking: We leren je zaak kennen en bekijken wat je nu doet op socials.
  2. Plan: We stellen samen een contentplan op: welke video's, welke boodschap, welk ritme.
  3. Shootdag: Eén vaste dag per maand filmen en fotograferen we bij jou ter plaatse.
  4. Oplevering: Je krijgt afgewerkte video's en foto's, klaar om te posten.
* Mobiel: onder elkaar, cijfers kleiner.

### 4.8 Diensten

Kaarten in een grid (stijl proplaymedia: donkere kaart, dunne rand, icoon linksboven, groot doorschijnend nummer rechtsboven, titel in condensed uppercase, korte tekst). Hover: rand → goud, kaart licht omhoog.

1. Short-form content (de hoofdkaart, mag breder): maandelijkse Reels, TikToks en Shorts.
2. Fotografie: zaak, team, producten, events.
3. Video & aftermovies: bedrijfsvideo's, openingen, events.
4. 360° virtuele tours: Matterport-tour van je zaak of showroom, te integreren op je site.
5. Livestreams: events en benefieten live in beeld.

### 4.9 Uitgelichte cases (preview naar /werk)

Genummerde lijst zoals proplaymedia ("01 / NAAM / sector"), volle breedte rijen met dunne scheidingslijnen. Hover op desktop: een kleine videopreview volgt de cursor. Klik → case op /werk. Startlijst (alles te bevestigen, namen alleen met toestemming):

* Voetbalkamp jeugd: 10 reels, 150+ foto's, 1 aftermovie, `[INVULLEN: views]`
* Feestzaal Antwerpen: foto + video bij de opening
* Veranda-bouwer: showroomfoto's + 360° tour op hun website
* Wellness Dilsen: reels, `[INVULLEN: views van de beste reel]`
* Profvoetballers (matchbeelden): `[INVULLEN: namen indien toegestaan]`
* Doorlopende reeks met een voetbalinfluencer: `[INVULLEN]`

Knop: "Bekijk al ons werk".

### 4.10 Over ons

Twee kolommen: links een foto van ons twee `[INVULLEN: foto]`, rechts: "TWEE BROERS. / ÉÉN BLIK." "Naitvision startte in 2022. Nait is onze familienaam, en ja, dat klinkt als knight. Vandaar het schaakpaard in ons logo. Wij filmen, monteren en leveren zelf. Je hebt één vast aanspreekpunt, geen tussenpersonen."

### 4.11 FAQ

Accordion, één open tegelijk, + draait naar ×. Vragen (antwoorden kort, `[INVULLEN]` waar nodig):

* Wat kost het? (geen bedragen; "elk pakket op maat, je krijgt na het eerste gesprek een vaste prijs")
* Moet ik zelf iets voorbereiden?
* Hoe vaak komen jullie filmen?
* Wie is eigenaar van de beelden?
* Werken jullie ook buiten Limburg?
* Kan ik ook één losse opdracht boeken?

Voeg FAQPage-schema toe.

### 4.12 Slot-CTA (de "GET TO NXT LEVEL"-sectie)

* Volledig scherm zwart. Bij scrollen bouwt de tekst "JOUW ZET." zich op als een gestapelde trail: dezelfde regel 5 keer onder elkaar, waarbij elke bovenliggende kopie meer afgesneden/vervaagd is en letter per letter verder aanvult, tot de onderste volledig en scherp staat (scrubbed met ScrollTrigger). Dit verwijst naar schaken; bewaak dat het subtiel blijft.
* Daaronder links in kleinere display-font: "LATEN WE IETS STERKS MAKEN." Rechts een pill-knop "Neem contact op".

### 4.13 Footer

Kolommen: logo | Contact (e-mail, telefoon, WhatsApp-link) | Regio ("Limburg, België") | Juridisch (Privacy) | Sitemap. Onderaan: © jaar Naitvision · ondernemingsnummer `[INVULLEN: BE ...]` (wettelijk verplicht op een Belgische bedrijfswebsite, samen met naam, adres en e-mail: `[INVULLEN]`).

### 4.14 /werk

* Hero: grote titel "ONS WERK".
* Filterknoppen: Alles / Short-form / Foto / Video / 360°.
* Masonry/grid met mix van 9:16 en 16:9; video speelt af bij hover (desktop) of in beeld (mobiel). Klik → lightbox met de volledige video.
* Per case optioneel een detailblok: klant, sector, wat we leverden, resultaat (alleen echte cijfers).

### 4.15 /contact

* Titel "VERTEL ONS WAT JE NODIG HEBT".
* Formulier: naam, bedrijf, e-mail, telefoon (optioneel), keuzechips "Waarvoor?" (Maandelijkse content / Foto / Video of aftermovie / 360° tour / Livestream / Iets anders), bericht. Duidelijke succes- en foutstatus. Turnstile.
* Ernaast: directe opties: WhatsApp-knop, e-mail, telefoon. `[INVULLEN]`.

## 5. Video en beeld: performance is cruciaal

Dit is een videozware site. Ze moet toch snel laden.

* Cloudflare Pages laat bestanden tot 25 MB toe en GitHub is geen opslag voor grote video's. Regels:
  * Loops op de site: 6 tot 10 seconden, zonder audio, max 720p (9:16 → 720×1280), doel < 3 MB per clip, H.264 MP4 + WebM-versie, met een poster-afbeelding (AVIF/WebP).
  * Volledige video's (lightbox): via YouTube (unlisted) of Cloudflare R2/Stream, lazy geladen pas bij klik.
* Maak een script `scripts/compress-videos.sh` dat met ffmpeg alle bestanden uit `raw/` (staat in `.gitignore`) omzet naar web-loops + posters in `public/media/`. Gebruik `-preset veryfast`, CRF ±26, `-movflags +faststart`, audio verwijderd.
* Afbeeldingen via Astro `<Image>` (AVIF/WebP, responsive srcset, lazy behalve boven de vouw).
* Doelen: Lighthouse mobiel ≥ 90 op Performance, ≥ 95 op Accessibility/SEO/Best Practices. LCP < 2,5s. Rapporteer de scores aan het eind.

## 6. SEO en technische basis

* Per pagina title en meta description (NL), canonical, Open Graph + Twitter-card met een OG-afbeelding (1200×630, zwart met logo en "CONTENT · FOTO · VIDEO").
* JSON-LD: `LocalBusiness` (naam, regio Limburg, contact, sameAs naar socials) + `FAQPage`.
* `sitemap.xml` (Astro sitemap-integratie), `robots.txt`, favicon set (uit het logo), `site.webmanifest`.
* Semantische HTML, één H1 per pagina, alt-teksten, zichtbare focus states (goud), menu volledig toetsenbord-bedienbaar, kleurcontrast AA.
* Privacy-pagina in gewone taal: welke gegevens het formulier verzamelt, waarvoor, hoe lang, contact voor vragen. Vermeld dat we cookieloze analytics gebruiken.

## 7. Wat je niet doet

* Geen verzonnen statistieken, nep-grafieken of "trusted by 100+ brands"-claims.
* Geen logo's van merken die geen directe klant waren.
* Geen gegarandeerde views/bereik, geen gegarandeerde levertermijnen.
* Geen prijzen op de site.
* Geen "ik"-vorm.
* Geen cookiebanner nodig, dus ook geen trackers toevoegen die er een vereisen.
* Geen generieke AI-look: geen paarse gradients, geen glassmorphism overal, geen emoji's als iconen. Iconen: één lijn-iconenset (bv. Lucide), dun.

## 8. Oplevering

Aan het eind lever je:

1. Werkende site lokaal + gepusht naar GitHub.
2. Een `README.md` met: lokaal draaien, content aanpassen (waar staat welke tekst), video's toevoegen via het compress-script, en stap voor stap deployen op Cloudflare Pages inclusief custom domain, Resend, Turnstile en Web Analytics.
3. Een lijst van alle `[INVULLEN]`-placeholders die nog openstaan, per pagina.
4. Lighthouse-scores mobiel en desktop.

## Wijzigingen na de brief

* 2026-11-08: geen goud. De site is strikt zwart-wit; `--accent` vervalt. Hover, focus en geselecteerde staten werken met inversie (off-white vlak, zwarte tekst) en een off-white focusring. Enkel het contactformulier gebruikt nog een kleur voor succes en fout, altijd met icoon en tekst. Zie het Naitvision design system.
* 2026-11-08: de site draait als Cloudflare Worker met static assets (niet als Pages). De contact-handler zit in `worker/contact.ts`, aangeroepen vanuit `worker/index.ts` (zie `wrangler.jsonc`). Placeholders worden in productie niet getoond. Hero staat op optie B. De over-ons-tekst verwijst naar het NV-logo dat effectief gebruikt wordt.
* 2026-11-08: /werk en de cases-sectie zijn verwijderd (301 naar /). Navigatie: DIENSTEN · AANPAK · CONTACT. Contact: info@naitvision.be, BTW BE 0788.569.418.
