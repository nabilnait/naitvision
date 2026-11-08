/**
 * ALL copy for the site lives here. Edit text in this file only.
 *
 * Placeholders: any string that starts with "[INVULLEN" is shown on the site
 * with a dashed outline until you replace it. Search this file for
 * "[INVULLEN" to see what is still open.
 *
 * Media: `media` is the base path of a loop in /public/media without extension.
 * The site loads `<media>.mp4` (and `<media>.webm` when `webm: true`) plus the
 * first-frame poster `<media>.webp` (an .avif is made too). Add new loops with `scripts/compress-videos.sh`.
 */

export type Media = {
  /** e.g. '/media/reel-barber'. Leave undefined for a grey placeholder panel. */
  media?: string;
  /** set to true once a .webm version exists next to the .mp4 */
  webm?: boolean;
  /** describes the clip for screen readers */
  alt: string;
  /** shown on the grey panel when there is no media yet */
  slotLabel?: string;
};

const nl = {
  lang: 'nl-BE',
  locale: 'nl_BE',

  meta: {
    siteName: 'Naitvision',
    domain: '[INVULLEN: domein, bv. naitvision.be]',
    titleSuffix: ' · Naitvision',
    defaultTitle: 'Naitvision · Content, foto en video in Limburg',
    defaultDescription:
      'Short-form content, fotografie en video voor lokale ondernemers in Limburg. Eén vaste shootdag per maand, content klaar om te posten.',
    ogImage: '/og.png',
  },

  business: {
    name: 'Naitvision',
    founded: '2022',
    region: 'Limburg, België',
    email: '[INVULLEN: e-mail]',
    phone: '[INVULLEN: telefoon]',
    /** international format without + or spaces, e.g. 32470123456 */
    whatsapp: '[INVULLEN: WhatsApp-nummer]',
    address: '[INVULLEN: adres]',
    vat: '[INVULLEN: BE ...]',
  },

  ui: {
    skip: 'Naar de inhoud',
    menuOpen: 'Menu openen',
    menuClose: 'Menu sluiten',
    mainNav: 'Hoofdmenu',
    prev: 'Vorige',
    next: 'Volgende',
    close: 'Sluiten',
    play: 'Video afspelen',
    socialsLabel: 'Volg ons',
  },

  nav: [
    { label: 'Diensten', href: '/#diensten' },
    { label: 'Werk', href: '/werk' },
    { label: 'Contact', href: '/contact' },
  ],
  headerCta: { label: 'Plan een gesprek', href: '/contact' },

  /** Which channels? Remove the ones you do not use. */
  socials: [
    { name: 'Instagram', icon: 'instagram', href: '[INVULLEN: Instagram-link]' },
    { name: 'TikTok', icon: 'tiktok', href: '[INVULLEN: TikTok-link]' },
    { name: 'LinkedIn', icon: 'linkedin', href: '[INVULLEN: LinkedIn-link]' },
  ],

  hero: {
    /** 'watermark' = A (black + logo watermark), 'video' = B (dimmed showreel behind it) */
    variant: 'video' as 'watermark' | 'video',
    /** Option B: up to three 9:16 loops side by side behind the words (one on phones), dimmed to 35%. */
    showreel: [
      { media: '/media/reel-barber', alt: '' },
      { media: '/media/reel-stadion', alt: '' },
      { media: '/media/reel-wellness', alt: '' },
    ] as Media[],
    words: ['Content', 'Foto', 'Video'],
    h1: 'Short-form content en beeld voor lokale ondernemers in Limburg.',
    scroll: 'Scroll',
  },

  marquee: {
    primary: ['Reels', 'TikTok', 'YouTube Shorts', 'Fotografie', 'Aftermovies', 'Events', '360° tours', 'Livestreams'],
    secondary: ['Horeca', 'Wellness', 'Retail', 'Bouw', 'Events', 'Sport'],
  },

  intro: {
    id: 'aanbod',
    title: ['Zichtbaar', 'blijven'],
    lead: 'Je zaak draait. Je socials niet altijd. Wij komen één dag per maand langs, filmen en fotograferen, en leveren content af die klaar is om te posten. Jij focust op je zaak.',
    /** 6–8 reels, 9:16. `label` is the client/project shown under the centre card. */
    reels: [
      { media: '/media/reel-barber', alt: 'Reel in een barbershop', label: '[INVULLEN: klant / project]' },
      { media: '/media/reel-wellness', alt: 'Reel van een wellnessavond', label: '[INVULLEN: klant / project]' },
      { media: '/media/reel-markt', alt: 'Reel op de markt met een ondernemer', label: '[INVULLEN: klant / project]' },
      { media: '/media/reel-voetbalkamp', alt: 'Reel van een jeugdvoetbalkamp', label: '[INVULLEN: klant / project]' },
      { media: '/media/reel-autodealer', alt: 'Reel bij een autodealer', label: '[INVULLEN: klant / project]' },
      { media: '/media/reel-presentatie', alt: 'Reel met een presentatrice aan een desk', label: '[INVULLEN: klant / project]' },
      { media: '/media/reel-physio-vr', alt: 'Reel van een kinesitherapiepraktijk met VR-bril', label: '[INVULLEN: klant / project]' },
      { media: '/media/reel-gym', alt: 'Reel in een sportschool', label: '[INVULLEN: klant / project]' },
    ],
  },

  clients: {
    label: 'Wij werkten voor',
    /** Only direct clients who gave permission. Optional `logo`: path to a monochrome SVG in /public/clients. */
    items: [] as { name: string; logo?: string }[],
    placeholder: '[INVULLEN: klantnaam]',
  },

  impact: {
    id: 'impact',
    title: ['Beeld dat', 'werkt'],
    lead: 'Goed beeld valt op in een tijdlijn vol ruis. Wij maken content die past bij je zaak en die mensen tegenhoudt tijdens het scrollen.',
    /** `value` is shown big. Use `count` for the count-up (number), `suffix` for e.g. 'M+'. */
    stats: [
      { value: '[INVULLEN: 120M+]', count: undefined as number | undefined, suffix: '', label: 'Views voor klanten' },
      { value: '[INVULLEN: aantal]', count: undefined as number | undefined, suffix: '', label: 'Projecten' },
      { value: '2022', count: 2022, suffix: '', label: 'Opgericht' },
    ],
    media: [
      { alt: 'Video 16:9', slotLabel: 'Video 16:9' },
      { alt: 'Video 16:9', slotLabel: 'Video 16:9' },
      { alt: 'Video 16:9', slotLabel: 'Video 16:9' },
    ] as Media[],
  },

  process: {
    id: 'aanpak',
    title: ['Onze', 'aanpak'],
    lead: 'Geen ingewikkelde trajecten. Vier stappen, en daarna een vast ritme.',
    steps: [
      { title: 'Kennismaking', text: 'We leren je zaak kennen en bekijken wat je nu doet op socials.' },
      { title: 'Plan', text: "We stellen samen een contentplan op: welke video's, welke boodschap, welk ritme." },
      { title: 'Shootdag', text: 'Eén vaste dag per maand filmen en fotograferen we bij jou ter plaatse.' },
      { title: 'Oplevering', text: "Je krijgt afgewerkte video's en foto's, klaar om te posten." },
    ],
  },

  services: {
    id: 'diensten',
    title: ['Wat we', 'maken'],
    lead: 'Maandelijkse content is de kern. Daarrond doen we alles wat je zaak in beeld brengt.',
    items: [
      { icon: 'smartphone', title: 'Short-form content', text: 'Maandelijkse Reels, TikToks en Shorts, gefilmd op één vaste shootdag.', wide: true },
      { icon: 'camera', title: 'Fotografie', text: 'Zaak, team, producten, events.' },
      { icon: 'film', title: 'Video & aftermovies', text: "Bedrijfsvideo's, openingen, events." },
      { icon: 'rotate3d', title: '360° virtuele tours', text: 'Matterport-tour van je zaak of showroom, te integreren op je site.' },
      { icon: 'radio', title: 'Livestreams', text: 'Events en benefieten live in beeld.' },
    ],
  },

  cases: {
    id: 'cases',
    label: 'Uitgelicht werk',
    title: ['Recent', 'werk'],
    cta: { label: 'Bekijk al ons werk', href: '/werk' },
    /** Names only with permission. `category` drives the filters on /werk. */
    items: [
      {
        slug: 'voetbalkamp-jeugd',
        name: 'Voetbalkamp jeugd',
        sector: 'Sport · events',
        category: ['short-form', 'foto', 'video'],
        delivered: '10 reels, 150+ foto’s, 1 aftermovie',
        result: '[INVULLEN: views]',
        media: '/media/reel-voetbalkamp',
      },
      {
        slug: 'feestzaal-antwerpen',
        name: 'Feestzaal Antwerpen',
        sector: 'Horeca · events',
        category: ['foto', 'video'],
        delivered: 'Foto en video bij de opening',
        result: '',
        media: undefined as string | undefined,
      },
      {
        slug: 'veranda-bouwer',
        name: 'Veranda-bouwer',
        sector: 'Bouw',
        category: ['foto', '360'],
        delivered: 'Showroomfoto’s en een 360° tour op hun website',
        result: '',
        media: undefined as string | undefined,
      },
      {
        slug: 'wellness-dilsen',
        name: 'Wellness Dilsen',
        sector: 'Wellness',
        category: ['short-form'],
        delivered: 'Reels',
        result: '[INVULLEN: views van de beste reel]',
        media: '/media/reel-wellness',
      },
      {
        slug: 'profvoetballers',
        name: 'Profvoetballers',
        sector: 'Sport · matchbeelden',
        category: ['video', 'foto'],
        delivered: '[INVULLEN: namen indien toegestaan]',
        result: '',
        media: '/media/reel-stadion',
      },
      {
        slug: 'voetbalinfluencer',
        name: 'Reeks met een voetbalinfluencer',
        sector: 'Sport · creator',
        category: ['short-form'],
        delivered: '[INVULLEN]',
        result: '',
        media: undefined as string | undefined,
      },
    ],
  },

  about: {
    id: 'over-ons',
    title: ['Twee broers.', 'Één blik.'],
    text: [
      'Naitvision startte in 2022. Nait is onze familienaam, en ja, dat klinkt als knight. Ons logo houdt het eenvoudig: een N en een V, voor Nait en Vision.',
      'Wij filmen, monteren en leveren zelf. Je hebt één vast aanspreekpunt, geen tussenpersonen.',
    ],
    photoAlt: 'De twee broers van Naitvision aan het werk, met een drone en een camera op gimbal',
  },

  faq: {
    id: 'faq',
    title: ['Vaak', 'gevraagd'],
    items: [
      { q: 'Wat kost het?', a: 'Elk pakket is op maat. Na het eerste gesprek krijg je een vaste prijs.' },
      { q: 'Moet ik zelf iets voorbereiden?', a: '[INVULLEN]' },
      { q: 'Hoe vaak komen jullie filmen?', a: 'Eén vaste shootdag per maand, bij jou ter plaatse. [INVULLEN: aanvullen indien nodig]' },
      { q: 'Wie is eigenaar van de beelden?', a: '[INVULLEN]' },
      { q: 'Werken jullie ook buiten Limburg?', a: '[INVULLEN]' },
      { q: 'Kan ik ook één losse opdracht boeken?', a: '[INVULLEN]' },
    ],
  },

  finalCta: {
    trail: 'Jouw zet.',
    line: 'Laten we iets sterks maken.',
    button: { label: 'Neem contact op', href: '/contact' },
  },

  footer: {
    contactTitle: 'Contact',
    regionTitle: 'Regio',
    legalTitle: 'Juridisch',
    sitemapTitle: 'Sitemap',
    whatsappLabel: 'WhatsApp',
    privacy: { label: 'Privacy', href: '/privacy' },
    sitemap: [
      { label: 'Home', href: '/' },
      { label: 'Werk', href: '/werk' },
      { label: 'Contact', href: '/contact' },
    ],
    vatLabel: 'Ondernemingsnummer',
  },

  pages: {
    werk: {
      title: 'Ons werk',
      metaTitle: 'Ons werk',
      metaDescription: 'Reels, foto, video en 360° tours die we maakten voor ondernemers in Limburg en daarbuiten.',
      filtersLabel: 'Filter op soort werk',
      filters: [
        { id: 'alles', label: 'Alles' },
        { id: 'short-form', label: 'Short-form' },
        { id: 'foto', label: 'Foto' },
        { id: 'video', label: 'Video' },
        { id: '360', label: '360°' },
      ],
      /** Grid items. `ratio` '9/16' or '16/9'. `full` = link to the full video (YouTube unlisted or R2) for the lightbox. */
      items: [
        { media: '/media/reel-barber', ratio: '9/16', category: ['short-form'], title: '[INVULLEN: klant]', alt: 'Reel in een barbershop', full: '' },
        { media: '/media/reel-stadion', ratio: '9/16', category: ['video'], title: '[INVULLEN: klant]', alt: 'Matchbeelden in een voetbalstadion', full: '' },
        { media: undefined, ratio: '16/9', category: ['video'], title: '[INVULLEN: aftermovie]', alt: 'Video 16:9', full: '' },
        { media: '/media/reel-wellness', ratio: '9/16', category: ['short-form'], title: 'Wellness Dilsen', alt: 'Reel van een wellnessavond', full: '' },
        { media: '/media/reel-drone', ratio: '9/16', category: ['video'], title: '[INVULLEN: klant]', alt: 'Dronebeelden boven een bedrijfsterrein met auto’s', full: '' },
        { media: undefined, ratio: '16/9', category: ['360'], title: '[INVULLEN: 360° tour]', alt: '360° tour', full: '' },
        { media: '/media/reel-voetbalkamp', ratio: '9/16', category: ['short-form', 'video'], title: 'Voetbalkamp jeugd', alt: 'Reel van een jeugdvoetbalkamp', full: '' },
        { media: '/media/reel-markt', ratio: '9/16', category: ['short-form'], title: '[INVULLEN: klant]', alt: 'Reel op de markt met een ondernemer', full: '' },
        { media: undefined, ratio: '16/9', category: ['foto'], title: '[INVULLEN: fotoreeks]', alt: 'Foto 16:9', full: '' },
        { media: '/media/reel-physio', ratio: '9/16', category: ['short-form'], title: '[INVULLEN: klant]', alt: 'Reel bij een kinesitherapeut', full: '' },
        { media: '/media/reel-athan', ratio: '9/16', category: ['video'], title: '[INVULLEN: klant]', alt: 'Video van een zanger tijdens een event', full: '' },
        { media: '/media/reel-autodealer', ratio: '9/16', category: ['short-form'], title: '[INVULLEN: klant]', alt: 'Reel bij een autodealer', full: '' },
        { media: '/media/reel-presentatie', ratio: '9/16', category: ['short-form'], title: '[INVULLEN: klant]', alt: 'Reel met een presentatrice', full: '' },
        { media: '/media/reel-gym', ratio: '9/16', category: ['short-form'], title: '[INVULLEN: klant]', alt: 'Reel in een sportschool', full: '' },
        { media: '/media/reel-physio-vr', ratio: '9/16', category: ['short-form'], title: '[INVULLEN: klant]', alt: 'Reel met een VR-bril bij een kinesitherapeut', full: '' },
      ] as { media?: string; webm?: boolean; ratio: '9/16' | '16/9'; category: string[]; title: string; alt: string; full: string }[],
      casesTitle: 'Cases',
      caseLabels: { client: 'Klant', sector: 'Sector', delivered: 'Wat we leverden', result: 'Resultaat' },
      empty: 'Nog geen werk in deze categorie.',
    },
    contact: {
      title: 'Vertel ons wat je nodig hebt',
      metaTitle: 'Contact',
      metaDescription: 'Plan een gesprek met Naitvision. Vertel ons wat je nodig hebt; we nemen zelf contact met je op.',
      intro: 'Een paar zinnen volstaan. We nemen zelf contact met je op.',
      fields: {
        name: 'Naam',
        company: 'Bedrijf',
        email: 'E-mail',
        phone: 'Telefoon (optioneel)',
        needs: 'Waarvoor?',
        message: 'Bericht',
        messagePlaceholder: 'Wat doet je zaak, en wat wil je in beeld brengen?',
      },
      needs: ['Maandelijkse content', 'Foto', 'Video of aftermovie', '360° tour', 'Livestream', 'Iets anders'],
      submit: 'Verstuur',
      sending: 'Bezig met versturen',
      success: 'Bedankt. Je bericht is verstuurd en we nemen contact met je op.',
      unavailable: 'Het formulier is tijdelijk niet beschikbaar. Contacteer ons rechtstreeks via de gegevens hiernaast.',
      errors: {
        required: 'Vul dit veld in.',
        email: 'Dit e-mailadres klopt niet. Controleer of er een @ en een domein in staan.',
        turnstile: 'De spamcontrole is niet gelukt. Vernieuw de pagina en probeer opnieuw.',
        server: 'Versturen is niet gelukt. Probeer het opnieuw, of mail ons rechtstreeks.',
      },
      directTitle: 'Liever rechtstreeks?',
      directWhatsapp: 'Stuur een WhatsApp',
      directEmail: 'Mail ons',
      directPhone: 'Bel ons',
    },
    privacy: {
      title: 'Privacy',
      metaTitle: 'Privacy',
      metaDescription: 'Welke gegevens Naitvision verzamelt via deze website, waarom, en hoe lang we ze bijhouden.',
      updated: 'Laatst bijgewerkt: [INVULLEN: datum]',
      sections: [
        {
          h: 'Wie zijn wij',
          p: ['Naitvision, [INVULLEN: adres], ondernemingsnummer [INVULLEN: BE ...]. Vragen over je gegevens stuur je naar [INVULLEN: e-mail].'],
        },
        {
          h: 'Wat het contactformulier verzamelt',
          p: [
            'Je naam, bedrijf, e-mailadres, telefoonnummer (als je het invult), wat je zoekt en je bericht.',
            'We gebruiken die gegevens alleen om je aanvraag te beantwoorden en, als we samenwerken, om die samenwerking op te volgen. We verkopen of delen ze niet voor marketing.',
          ],
        },
        {
          h: 'Hoe het verstuurd wordt',
          p: [
            'Je bericht gaat via de e-maildienst Resend naar onze mailbox. Cloudflare Turnstile controleert of het formulier door een mens werd ingevuld; daarvoor verwerkt Cloudflare technische gegevens van je browser.',
          ],
        },
        {
          h: 'Hoe lang we het bewaren',
          p: ['[INVULLEN: bewaartermijn, bv. tot 2 jaar na het laatste contact, of zolang we samenwerken plus de wettelijke boekhoudtermijn].'],
        },
        {
          h: 'Statistieken zonder cookies',
          p: [
            'We meten het bezoek aan deze site met Cloudflare Web Analytics. Dat werkt zonder cookies en zonder je te volgen over andere sites. Daarom zie je geen cookiebanner.',
          ],
        },
        {
          h: 'Je rechten',
          p: [
            'Je kan altijd vragen welke gegevens we van je hebben, ze laten aanpassen of laten verwijderen. Mail naar [INVULLEN: e-mail]. Ben je niet tevreden over hoe we ermee omgaan, dan kan je klacht indienen bij de Gegevensbeschermingsautoriteit (gegevensbeschermingsautoriteit.be).',
          ],
        },
      ],
    },
    notFound: {
      title: 'Deze zet bestaat niet.',
      text: 'De pagina die je zoekt is verplaatst of bestaat niet meer.',
      button: { label: 'Terug naar home', href: '/' },
      metaTitle: 'Pagina niet gevonden',
    },
  },
};

export type SiteContent = typeof nl;
export const content = { nl } satisfies Record<string, SiteContent>;
