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
    email: 'info@naitvision.be',
    /** Leave empty to hide. Format as you want it shown, e.g. '+32 470 12 34 56'. */
    phone: '',
    /** Leave empty to hide. International format without + or spaces, e.g. 32470123456. */
    whatsapp: '32485103930',
    /** How the WhatsApp number is shown on the page. */
    whatsappDisplay: '+32 485 10 39 30',
    /** Text that is already filled in when someone opens WhatsApp from the site. */
    whatsappMessage: 'Hallo Naitvision, ik heb een vraag over ',
    /** Legally required. Shown in the footer and on /privacy as soon as it is filled in. */
    address: '[INVULLEN: adres]',
    /** As shown on the site; the structured data uses it without spaces and dots. */
    vat: 'BE 0788.569.418',
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
    whatsappButton: 'WhatsApp',
    whatsappAria: 'Stuur ons een bericht via WhatsApp (opent WhatsApp)',
    socialsLabel: 'Volg ons',
  },

  nav: [
    { label: 'Diensten', href: '/#diensten' },
    { label: 'Aanpak', href: '/#aanpak' },
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
      { q: 'Moet ik zelf iets voorbereiden?', a: 'Weinig. Wat we filmen leggen we vooraf samen vast in het contentplan. Op de shootdag vragen we alleen dat je zaak er klaar voor is en dat wie in beeld komt even tijd heeft.' },
      { q: 'Hoe vaak komen jullie filmen?', a: 'Eén vaste shootdag per maand, bij jou ter plaatse. We plannen die dag samen in, zodat hij past in jouw agenda.' },
      { q: 'Wie is eigenaar van de beelden?', a: 'Je mag alle afgewerkte video\'s en foto\'s vrij gebruiken voor je eigen zaak: op je socials, je website en in advertenties. De afspraken daarover staan zwart op wit in je offerte.' },
      { q: 'Werken jullie ook buiten Limburg?', a: 'Ja. We werken het vaakst in Limburg, maar filmden ook al in Antwerpen en in het buitenland. Verplaatsingen buiten Limburg bespreken we vooraf.' },
      { q: 'Kan ik ook één losse opdracht boeken?', a: 'Ja. Maandelijkse content is onze kern, maar je kan ons ook voor één opdracht boeken: een fotoshoot, een aftermovie, een 360° tour of een livestream.' },
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
      { label: 'Diensten', href: '/#diensten' },
      { label: 'Aanpak', href: '/#aanpak' },
      { label: 'Contact', href: '/contact' },
    ],
    vatLabel: 'BTW',
  },

  pages: {
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
          p: ['Naitvision, btw-nummer BE 0788.569.418. Adres: [INVULLEN: adres]. Vragen over je gegevens stuur je naar info@naitvision.be.'],
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
            'Je kan altijd vragen welke gegevens we van je hebben, ze laten aanpassen of laten verwijderen. Mail naar info@naitvision.be. Ben je niet tevreden over hoe we ermee omgaan, dan kan je klacht indienen bij de Gegevensbeschermingsautoriteit (gegevensbeschermingsautoriteit.be).',
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
