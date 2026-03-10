
export const site = {
  brand: {
    ro: "Nu în numele meu",
    en: "Not In My Name",
  },
  siteUrl: process.env.SITE_URL || "",
  gaMeasurementId: process.env.GA_MEASUREMENT_ID || "",
  basePath: process.env.BASE_PATH || "",
  signUrl: (process.env.SIGN_URL || "").trim(),
  signProvider: (process.env.SIGN_PROVIDER || "").trim(),
  sourceCodeUrl: (process.env.SOURCE_CODE_URL || "").trim(),
  sourceCodePlatform: (process.env.SOURCE_CODE_PLATFORM || "").trim(),
  defaultLocale: "ro",
  locales: ["ro", "en"],
  themeColor: "#08111d",
};
const hasSignerProviderConfig = Boolean(site.signUrl && site.signProvider);
const hasSourceCodeConfig = Boolean(site.sourceCodeUrl && site.sourceCodePlatform);

const toGoogleTranslateEn = (url) =>
  `https://translate.google.com/translate?sl=ro&tl=en&u=${encodeURIComponent(url)}`;

const sharedLinksRo = {
  og85: "https://legislatie.just.ro/Public/FormaPrintabila/00000G2OBL19NS1NJH00U5MO6FHB2RJ7",
  oug50: "https://legislatie.just.ro/Public/DetaliiDocumentAfis/119472",
  law129: "https://legislatie.just.ro/Public/DetaliiDocumentAfis/303053",
  ril23: "https://legislatie.just.ro/Public/DetaliiDocument/223224",
  og27: "https://legislatie.just.ro/Public/DetaliiDocument/33817",
  ebaRemote: "https://www.eba.europa.eu/publications-and-media/press-releases/eba-publishes-guidelines-remote-customer-onboarding",
  amld: "https://eur-lex.europa.eu/eli/dir/2015/849/oj/eng?eliuri=eli%3Adir%3A2015%3A849%3Aoj&locale=ro",
  snoop: "https://snoop.ro/fenomenul-creditelor-false-cu-buletine-furate-pentru-credite-la-ifn-uri-sub-ochii-autoritatilor/",
  hotnews: "https://hotnews.ro/adrian-si-a-facut-un-card-de-benzina-la-rompetrol-iar-dupa-jumatate-de-an-s-a-trezit-ca-are-de-platit-o-suma-uriasa-la-mai-multe-ifn-uri-ceva-care-trebuia-sa-mi-faca-viata-mai-usoara-mi-a-f-1795545",
  libertatea: "https://www.libertatea.ro/stiri/mi-s-a-dat-viata-peste-cap-calvarul-unui-client-rompetrol-ale-carui-date-personale-furnizate-companiei-au-fost-folosite-pentru-credite-ilegale-4720529",
  protv: "https://stirileprotv.ro/stiri/inspectorul-pro/imprumuturi-online-luate-cu-datele-altora-cum-s-a-trezit-un-roman-ca-e-dator-la-trei-ifn-uri.html",
  chamberMembers: "https://www.cdep.ro/pls/parlam/structura2015.de?leg=2024&cam=2&idl=1",
  senateMembers: "https://www.senat.ro/FisaSenatori.aspx",
  mepMembers: "https://www.europarl.europa.eu/meps/en/search/advanced?countryCode=RO",
};

const sharedLinksEn = {
  og85: toGoogleTranslateEn(sharedLinksRo.og85),
  oug50: toGoogleTranslateEn(sharedLinksRo.oug50),
  law129: toGoogleTranslateEn(sharedLinksRo.law129),
  ril23: toGoogleTranslateEn(sharedLinksRo.ril23),
  og27: toGoogleTranslateEn(sharedLinksRo.og27),
  ebaRemote: sharedLinksRo.ebaRemote,
  amld: "https://eur-lex.europa.eu/eli/dir/2015/849/oj/eng?eliuri=eli%3Adir%3A2015%3A849%3Aoj&locale=en",
  snoop: toGoogleTranslateEn(sharedLinksRo.snoop),
  hotnews: toGoogleTranslateEn(sharedLinksRo.hotnews),
  libertatea: toGoogleTranslateEn(sharedLinksRo.libertatea),
  protv: toGoogleTranslateEn(sharedLinksRo.protv),
  chamberMembers: toGoogleTranslateEn(sharedLinksRo.chamberMembers),
  senateMembers: toGoogleTranslateEn(sharedLinksRo.senateMembers),
  mepMembers: sharedLinksRo.mepMembers,
};

export const sharedLinks = {
  ro: sharedLinksRo,
  en: sharedLinksEn,
};

export const content = {
  ro: {
    locale: "ro",
    localeName: "Română",
    oppositeLocaleName: "English",
    pathPrefix: "",
    tagline: "Fără identitate verificată, fără credit executoriu.",
    homePath: "/",
    petitionPath: "/petition/",
    resourcesPath: "/resources/",
    privacyPath: "/privacy/",
    nav: [
      { type: "anchor", id: "problem", label: "Problema" },
      { type: "anchor", id: "asks", label: "Ce cerem" },
      { type: "anchor", id: "law", label: "Baza legală" },
      { type: "anchor", id: "complaints", label: "Modele de plângere" },
      { type: "anchor", id: "faq", label: "FAQ" },
      { type: "route", route: "resources", label: "Resurse" },
      { type: "route", route: "petition", label: "Petiția" },
    ],
    footer: {
      lead: "Campanie civică pentru protecția oamenilor afectați de credite făcute cu date furate.",
      note: "Pentru protecția datelor personale, documentul semnat complet nu este publicat pe site. Când distribui campania, trimite linkul site-ului sau un PDF în care datele personale sunt ascunse.",
      legal: "Conținut informativ și de advocacy. Nu constituie consultanță juridică individuală.",
      sourceCode: hasSourceCodeConfig
        ? {
          intro: "Pentru transparență, codul sursă este disponibil pe",
          linkLabel: site.sourceCodePlatform
        }
        : null,
      linksLabel: "Pagini",
      links: [
        { label: "Acasă", route: "home" },
        { label: "Petiția", route: "petition" },
        { label: "Resurse", route: "resources" },
        { label: "Confidențialitate", route: "privacy" },
      ],
    },
    share: {
      title: "Distribuie campania",
      body: "Date furate nu înseamnă consimțământ. Cerem modificarea O.G. nr. 85/2004 pentru verificarea robustă a identității la creditele la distanță.",
      button: "Distribuie",
      copy: "Copiază linkul",
      copied: "Link copiat.",
      email: "Trimite pe email",
    },
    labels: {
      openMenu: "Deschide meniul",
      closeMenu: "Închide meniul",
      switchTo: "English",
      skipToContent: "Sari la conținut",
      readSource: "Sursă oficială",
      readMore: "Detalii",
      updated: "Versiune publică optimizată pentru distribuire",
    },
    accessibility: {
      dockLabel: "Controale accesibilitate",
      privacyButton: "Setări confidențialitate",
      fontLabel: "Mărime text",
      themeLabel: "Temă pagină",
      fontDecrease: "A-",
      fontReset: "A",
      fontIncrease: "A+",
      themeAuto: "Auto",
      themeLight: "Light",
      themeDark: "Dark",
      currentFontPrefix: "Text",
      privacySectionTitle: "Controale de accesibilitate",
      privacySectionIntro: "Poți deschide rapid setările de confidențialitate, poți mări sau micșora textul și poți alege tema paginii. Implicit, tema urmează setarea browserului."
    },
    home: {
      meta: {
        title: "Nu în numele meu - Fără identitate verificată, fără credit executoriu",
        description: "Campanie pentru modificarea O.G. nr. 85/2004: verificare robustă a identității la creditele online, suspendarea executării în caz de fraudă și protecție reală pentru consumatori.",
        keywords: [
          "frauda de identitate",
          "credite online",
          "OG 85/2004",
          "ANPC",
          "verificare identitate",
          "executare silită",
          "IFN",
          "credit la distanță"
        ],
        ogImage: "/og/cover-ro.png",
      },
      hero: {
        eyebrow: "Campanie pentru modificarea O.G. nr. 85/2004",
        title: "Nu în numele meu.",
        subtitle: "Fără identitate verificată, fără credit executoriu.",
        intro: "Pe scurt: cineva îți poate folosi datele și poate lua un credit în numele tău. Apoi tu rămâi cu datorii, popriri și drumuri la instituții. Cerem o regulă simplă: fără verificarea clară a identității, fără executare împotriva persoanei nevinovate.",
        chips: ["O.G. nr. 85/2004", "O.U.G. nr. 50/2010", "Legea nr. 129/2019", "RIL nr. 23/2019"],
        primaryCta: { label: "Citește petiția", route: "petition" },
        secondaryCta: { label: "Explorează resursele", route: "resources" },
        stats: [
          { value: "1", label: "lege-cheie de actualizat", note: "O.G. nr. 85/2004" },
          { value: "6", label: "garanții concrete", note: "de la liveness la suspendarea executării" },
          { value: "0", label: "cost pentru cetățean", note: "informație publică și modele gratuite" },
        ],
      },
      problem: {
        title: "Date furate nu înseamnă consimțământ.",
        intro: "Când datele tale sunt folosite de altcineva, nu e corect să plătești tu. Totuși, în practică, victima este cea care suferă prima: conturi blocate, stres și timp pierdut ca să dovedească că nu a cerut creditul.",
        cards: [
          {
            kicker: "01",
            title: "Datele ajung la altcineva",
            text: "Un infractor poate folosi copia buletinului sau date personale furate ca să ceară un credit online."
          },
          {
            kicker: "02",
            title: "Creditul se aprobă prea ușor",
            text: "În multe fluxuri online, verificarea identității nu este suficient de puternică înainte să fie dați banii."
          },
          {
            kicker: "03",
            title: "Consecințele apar rapid",
            text: "După acordarea creditului pot apărea popriri și alte măsuri, chiar dacă persoana reală nu a fost de acord."
          },
          {
            kicker: "04",
            title: "Victima repară după pagubă",
            text: "Omul nevinovat trebuie să oprească executarea și să dovedească faptul că identitatea i-a fost folosită fraudulos."
          }
        ],
        timelineTitle: "Cum se întâmplă, pas cu pas",
        timeline: [
          {
            title: "1. Datele sunt furate",
            text: "Prin phishing, breșe de securitate sau copii de acte folosite abuziv."
          },
          {
            title: "2. Se cere un credit online",
            text: "Aplicația merge mai departe fără o verificare clară și strictă a persoanei reale."
          },
          {
            title: "3. Apar efectele",
            text: "Banii se dau, apar datorii și pot începe măsuri de executare."
          },
          {
            title: "4. Victima dovedește nevinovăția",
            text: "Abia după pagubă începe lupta birocratică și juridică."
          }
        ],
      },
      asks: {
        title: "Reguli simple. Protecție reală.",
        intro: "Nu vrem să oprim creditele online. Vrem reguli simple, clare și corecte pentru oameni.",
        cards: [
          {
            kicker: "A1",
            title: "Verificare reală înainte de credit",
            text: "Identitatea trebuie verificată clar înainte de semnare și înainte de acordarea banilor."
          },
          {
            kicker: "A2",
            title: "Două verificări, nu una",
            text: "Verificarea trebuie să includă fața persoanei reale (liveness) plus încă o verificare separată."
          },
          {
            kicker: "A3",
            title: "Fără bani înainte de verificare",
            text: "Creditul nu trebuie plătit până când toate verificările obligatorii nu sunt trecute."
          },
          {
            kicker: "A4",
            title: "Fără verificare, fără executare",
            text: "Dacă lipsesc verificările minime, contractul nu trebuie folosit pentru executare silită."
          },
          {
            kicker: "A5",
            title: "Pauză la executare când reclami fraudă",
            text: "Dacă victima depune o sesizare serioasă, executarea și raportările negative trebuie oprite temporar."
          },
          {
            kicker: "A6",
            title: "Dovezi păstrate în timp",
            text: "Companiile trebuie să păstreze dovezile verificării identității cel puțin 5 ani."
          }
        ],
        compareTitle: "Astăzi vs. după reformă",
        compare: {
          beforeTitle: "Astăzi",
          beforeItems: [
            "creditul poate fi acordat prea repede, fără filtre suficiente",
            "victima suportă prima consecințele",
            "problema se discută abia după ce apare paguba",
            "nu există o legătură clară între verificare și executare"
          ],
          afterTitle: "După reformă",
          afterItems: [
            "identitatea se verifică înainte de orice plată",
            "contractul fără verificări minime nu poate fi executat",
            "sesizarea victimei oprește temporar prejudiciul",
            "creditarea online rămâne, dar cu reguli clare"
          ]
        }
      },
      law: {
        title: "Există reguli. Trebuie doar făcute mai clare.",
        intro: "Legile actuale conțin deja părți importante, dar nu protejează suficient victima în practică. Campania cere reguli mai clare și aplicabile.",
        cards: [
          {
            title: "O.G. nr. 85/2004 - art. 8, 23 și 24",
            summary: "Reglementează cum se încheie contractul la distanță și rolul ANPC în protecția consumatorului.",
            href: sharedLinks.ro.og85,
            tag: "ANPC + consimțământ"
          },
          {
            title: "RIL nr. 23/2019",
            summary: "Decizia arată că un contract la distanță poate produce efecte puternice chiar fără semnătură clasică.",
            href: sharedLinks.ro.ril23,
            tag: "titlu executoriu"
          },
          {
            title: "O.U.G. nr. 50/2010 - informații precontractuale",
            summary: "Spune ce informații trebuie să primească omul înainte să accepte un credit.",
            href: sharedLinks.ro.oug50,
            tag: "informare"
          },
          {
            title: "Legea nr. 129/2019 - KYC și păstrarea dovezilor",
            summary: "Cere verificarea identității din surse sigure și păstrarea dovezilor.",
            href: sharedLinks.ro.law129,
            tag: "KYC"
          },
          {
            title: "O.G. nr. 27/2002 - termene pentru petiții",
            summary: "Explică în cât timp trebuie să răspundă instituțiile la petiții.",
            href: sharedLinks.ro.og27,
            tag: "procedură"
          },
          {
            title: "Context european - AMLD și EBA",
            summary: "La nivel UE există deja standarde pentru identificare la distanță și controlul riscului.",
            href: sharedLinks.ro.ebaRemote,
            tag: "cadru UE"
          }
        ]
      },
      complaints: {
        title: "Modele de plângere personalizate",
        intro: "Completează datele tale, iar textul petiției se actualizează automat, în timp real. Îl poți copia sau trimite direct pe email.",
        targetLabel: "Model pentru",
        memberFinder: {
          title: "Găsește rapid adresele oficiale",
          links: [
            { label: "Camera Deputaților", href: sharedLinks.ro.chamberMembers },
            { label: "Senat", href: sharedLinks.ro.senateMembers },
            { label: "Europarlamentari", href: sharedLinks.ro.mepMembers }
          ]
        },
        targets: [
          { value: "parliamentarians", label: "Parlamentari (RO)" },
          { value: "senators", label: "Senatori (RO)" },
          { value: "deputies", label: "Camera Deputaților (RO)" },
          { value: "meps", label: "Europarlamentari (EN)" }
        ],
        fields: {
          name: "Nume Prenume",
          city: "Oraș",
          county: "Județ",
          email: "Email",
          phone: "Telefon",
          recipients: "Email destinatari (opțional)"
        },
        placeholders: {
          name: "Ex: Ionescu Maria",
          city: "Ex: București",
          county: "Ex: Ilfov",
          email: "Ex: nume@domeniu.ro",
          phone: "Ex: 07xxxxxxxx",
          recipients: "Ex: senator1@institutie.ro, senator2@institutie.ro"
        },
        actions: {
          copySubject: "Copiază subiectul",
          copyBody: "Copiază textul",
          email: "Deschide email"
        },
        output: {
          subject: "Subiect email",
          body: "Text petiție",
          emptySubject: "Subiectul se completează automat când introduci datele tale.",
          emptyBody: "Textul se completează automat, în timp real, pe măsură ce scrii."
        },
        privacy: "Datele nu sunt stocate, trimise sau prelucrate pe server. Totul se face doar local, în browserul tău."
      },
      faq: {
        title: "Întrebări frecvente",
        items: [
          {
            q: "Este această campanie împotriva creditelor online?",
            a: "Nu. Campania este pentru credite online mai sigure, nu împotriva lor."
          },
          {
            q: "Cerem doar semnătură electronică calificată?",
            a: "Nu. Cerem mai multe verificări ale identității, nu o singură metodă."
          },
          {
            q: "De ce este important rolul ANPC?",
            a: "Pentru că ANPC este instituția care poate primi și analiza reclamațiile consumatorilor în această zonă."
          },
          {
            q: "Ce se schimbă pentru victime?",
            a: "Victima trebuie protejată imediat: oprirea temporară a executării până se verifică situația."
          },
          {
            q: "Publicați documentul semnat integral?",
            a: "Nu. Documentul semnat complet conține date personale, deci nu îl publicăm integral. Pe site găsești varianta publică, fără date sensibile."
          }
        ]
      },
      action: {
        title: "Trei pași simpli",
        cards: [
          {
            title: "Citește petiția",
            text: "Vezi clar ce cerem și de ce.",
            route: "petition",
            cta: "Deschide petiția"
          },
          {
            title: "Distribuie campania",
            text: "Trimite mai departe mesajul către familie, prieteni și comunitate.",
            action: "share",
            cta: "Distribuie acum"
          },
          {
            title: "Verifică sursele",
            text: "Ai la un loc legile importante și cazuri reale din presă.",
            route: "resources",
            cta: "Vezi resursele"
          }
        ]
      }
    },
    petition: {
      meta: {
        title: "Petiția pentru modificarea O.G. nr. 85/2004",
        description: "Explicat simplu: ce schimbări cerem pentru ca oamenii să nu mai plătească pentru credite făcute cu date furate.",
        keywords: [
          "petiție ANPC",
          "modificare OG 85/2004",
          "frauda de identitate",
          "credit la distanță",
          "executare"
        ],
        ogImage: "/og/cover-ro.png",
      },
      hero: {
        eyebrow: "Petiția publică",
        title: "Petiția, pe înțelesul tuturor",
        intro: "Aici găsești, în cuvinte simple, ce cerem autorităților ca victimele fraudei de identitate să fie protejate mai bine.",
        secondaryCta: { label: "Vezi sursele", route: "resources" },
      },
      summaryTitle: "Rezumat simplu",
      summary: [
        "Petiția pornește de la cazuri reale în care oameni nevinovați au rămas cu datorii făcute în numele lor.",
        "Problema este simplă: în prezent, creditul poate produce efecte puternice chiar dacă verificarea identității nu a fost suficientă.",
        "Soluția noastră nu oprește creditele online. Cere doar verificare clară înainte de acordare și protecție rapidă pentru victimă."
      ],
      sections: [
        {
          title: "Ce solicită petiția",
          items: [
            "verificarea clară a identității înainte de semnare și înainte de acordarea banilor",
            "cel puțin două verificări independente, nu una singură",
            "fără disbursare până la finalizarea verificărilor",
            "fără executare silită dacă verificările minime nu au fost respectate",
            "oprirea temporară a executării când victima reclamă fraudă de identitate",
            "păstrarea dovezilor de verificare timp de minimum 5 ani"
          ]
        },
        {
          title: "De ce ANPC",
          items: [
            "ANPC este instituția care primește și analizează reclamațiile consumatorilor în acest domeniu.",
            "Cerem ANPC să susțină schimbarea rapidă a regulilor care permit astfel de abuzuri.",
            "Pentru oameni contează trei lucruri: consimțământ real, dovadă clară și remediu rapid."
          ]
        }
      ],
      proposalTitle: "Ce propunem, pe scurt",
      proposalLead: "Mai jos este varianta simplificată a schimbărilor propuse:",
      proposal: [
        {
          label: "(5)",
          text: "Înainte de contract și înainte de plata banilor, creditorul verifică identitatea clientului prin mai multe metode."
        },
        {
          label: "(5¹)",
          text: "Verificarea include obligatoriu control biometric cu liveness și cel puțin încă o verificare separată."
        },
        {
          label: "(6)",
          text: "Disbursarea fondurilor este interzisă până la finalizarea cu succes a verificărilor."
        },
        {
          label: "(7)",
          text: "Dacă verificările minime nu sunt respectate, contractul nu poate fi folosit pentru executare."
        },
        {
          label: "(8)",
          text: "Dacă există o sesizare motivată de fraudă de identitate, executarea și raportările negative se suspendă temporar."
        },
        {
          label: "(9)",
          text: "Creditorul păstrează dovezile tehnice ale verificării timp de minimum 5 ani."
        },
        {
          label: "(10)",
          text: "Autoritățile stabilesc standarde tehnice clare pentru verificare și siguranță."
        }
      ],
      requestsTitle: "Solicitările adresate ANPC",
      requests: [
        "confirmarea oficială că petiția a fost înregistrată",
        "analiza urgentă a modificării O.G. nr. 85/2004",
        "alinierea regulilor cu celelalte acte normative importante",
        "verificarea modului în care creditorii verifică identitatea în prezent",
        "un răspuns scris clar, cu pașii următori"
      ],
      balanceTitle: "O reformă fermă, dar proporțională",
      balanceCards: [
        {
          title: "Nu oprește creditele online",
          text: "Creditarea rămâne posibilă, dar cu reguli mai sigure."
        },
        {
          title: "Protejează înainte de pagubă",
          text: "Victima nu mai ajunge să repare totul doar după ce apare prejudiciul."
        },
        {
          title: "Reguli clare pentru toți",
          text: "Cerințele devin simple, verificabile și ușor de controlat."
        }
      ],
      sign: hasSignerProviderConfig
        ? {
          title: `Semnează petiția pe platforma ${site.signProvider}`,
          intro: `Nu controlam colectarea date personale pe acest site. Pentru semnare, folosește pagina oficială a campaniei ${site.signProvider}.`,
          cta: `Semnează pe platforma ${site.signProvider}`,
          linkLabel: "Deschide pagina de semnare"
        }
        : null,
      privacyNote: "Pe site este publicată doar varianta fără date personale. Dacă trimiți un PDF, ascunde mai întâi datele sensibile."
    },
    resources: {
      meta: {
        title: "Resurse juridice și presă despre frauda de identitate la creditele online",
        description: "Legi și articole explicate simplu, pentru cine vrea să verifice sursele campaniei.",
        keywords: [
          "resurse juridice",
          "OG 85/2004",
          "Legea 129/2019",
          "RIL 23/2019",
          "frauda de identitate"
        ],
        ogImage: "/og/cover-ro.png",
      },
      hero: {
        eyebrow: "Resurse",
        title: "Legi importante și cazuri reale",
        intro: "Aici găsești, la un loc, sursele principale pe care se bazează campania."
      },
      groups: [
        {
          title: "Articole și cazuri mediatizate",
          items: [
            {
              title: "Snoop",
              text: "Investigație despre credite luate cu date și acte furate.",
              href: sharedLinks.ro.snoop,
              cta: "Citește articolul"
            },
            {
              title: "HotNews",
              text: "Caz despre folosirea datelor personale pentru credite fără acordul real al persoanei.",
              href: sharedLinks.ro.hotnews,
              cta: "Citește articolul"
            },
            {
              title: "Libertatea",
              text: "Exemplu concret de date personale folosite abuziv pentru credite.",
              href: sharedLinks.ro.libertatea,
              cta: "Citește articolul"
            },
            {
              title: "Știrile ProTV",
              text: "Exemple de împrumuturi luate cu datele altor persoane și consecințele lor.",
              href: sharedLinks.ro.protv,
              cta: "Citește articolul"
            }
          ]
        },
        {
          title: "Surse juridice primare",
          items: [
            {
              title: "O.G. nr. 85/2004",
              text: "Legea principală din această campanie. Explică modul contractelor la distanță și rolul ANPC.",
              href: sharedLinks.ro.og85,
              cta: "Deschide actul"
            },
            {
              title: "Decizia ÎCCJ (RIL) nr. 23/2019",
              text: "Decizie importantă care arată cât de puternice pot fi efectele unui contract la distanță.",
              href: sharedLinks.ro.ril23,
              cta: "Deschide decizia"
            },
            {
              title: "O.U.G. nr. 50/2010",
              text: "Reguli pentru creditele de consum și informațiile care trebuie oferite înainte de contract.",
              href: sharedLinks.ro.oug50,
              cta: "Deschide actul"
            },
            {
              title: "Legea nr. 129/2019",
              text: "Cere verificarea identității din surse sigure și păstrarea dovezilor.",
              href: sharedLinks.ro.law129,
              cta: "Deschide actul"
            },
            {
              title: "O.G. nr. 27/2002",
              text: "Explică modul de depunere a petițiilor și termenele de răspuns.",
              href: sharedLinks.ro.og27,
              cta: "Deschide actul"
            }
          ]
        },
        {
          title: "Context european",
          items: [
            {
              title: "AMLD - Directiva (UE) 2015/849",
              text: "Reguli europene de bază pentru verificarea clienților în zona financiară.",
              href: sharedLinks.ro.amld,
              cta: "Deschide directiva"
            },
            {
              title: "EBA - Remote customer onboarding",
              text: "Ghiduri europene despre identificarea clienților la distanță.",
              href: sharedLinks.ro.ebaRemote,
              cta: "Deschide materialul"
            }
          ]
        }
      ],
      embed: {
        title: "Sticker pentru site-ul tău",
        intro: "Dacă vrei să susții campania pe propriul site, folosește codul de mai jos pentru a integra stickerul oficial.",
        previewLabel: "Preview sticker Nu în numele meu",
        codeLabel: "Cod embed (HTML)",
        copyCta: "Copiază codul"
      },
      calloutTitle: "Cum folosești această pagină",
      calloutText: "Dacă vrei să trimiți mai departe campania, este suficient linkul către petiție și această pagină de surse."
    },
    consent: {
      title: "Setări de confidențialitate",
      bannerWithGa: "Folosim măsurare minimă de trafic pentru a înțelege câți vizitatori ajung pe site. Poți alege dacă activezi analytics.",
      bannerWithoutGa: "Folosim doar stocare locală strict necesară pentru funcționarea site-ului (limbă, secțiune curentă, consimțământ).",
      essentialTitle: "Stocare esențială",
      essentialDesc: "Necesară pentru funcțiile de bază ale site-ului. Nu poate fi dezactivată.",
      analyticsTitle: "Măsurare vizitatori (Google Analytics)",
      analyticsDesc: "Măsoară numărul de vizitatori și paginile accesate.",
      interactionsTitle: "Interacțiuni pe site (click-uri, fără conținut)",
      interactionsDesc: "Trimite doar faptul că ai interacționat cu elemente precum navigare, copiere subiect/text sau completare câmpuri, fără a trimite valorile introduse.",
      alwaysOnLabel: "Mereu activ",
      noGaSettingsNote: "În această versiune nu este activat niciun serviciu de analytics terț.",
      openSettings: "Setări confidențialitate",
      acceptAll: "Accept tot",
      rejectAll: "Refuz opționalul",
      openPanel: "Personalizează",
      save: "Salvează setările",
      openPrivacyPage: "Pagina de confidențialitate",
      close: "Închide"
    },
    privacy: {
      meta: {
        title: "Confidențialitate și cookies",
        description: "Cum folosim date minime pe site și cum poți controla setările de confidențialitate.",
        keywords: [
          "confidențialitate",
          "cookies",
          "setări GDPR",
          "date minime"
        ],
        ogImage: "/og/cover-ro.png",
      },
      hero: {
        eyebrow: "Confidențialitate",
        title: "Date minime, control clar",
        intro: "Pe această pagină explicăm ce date folosim, de ce le folosim și cum îți poți schimba oricând opțiunile."
      },
      sections: [
        {
          title: "Ce stocăm în mod esențial",
          items: [
            "limba aleasă de tine",
            "secțiunea curentă din pagină, pentru a reveni direct unde ai rămas",
            "preferințele de consimțământ"
          ]
        },
        {
          title: "Ce NU facem implicit",
          items: [
            "nu activăm tracking de analytics înainte de acordul tău",
            "nu activăm publicitate personalizată",
            "nu colectăm date mai multe decât este necesar pentru funcționarea de bază"
          ]
        }
      ],
      signProviderNotice: hasSignerProviderConfig
        ? {
          title: `Platforma de semnare ${site.signProvider}`,
          items: [
            `Când accesezi pagina externă a platformei ${site.signProvider} pentru semnare, cookie-urile și tehnologiile similare de acolo sunt controlate de platforma ${site.signProvider}, nu de acest site.`,
            `Politica noastră de confidențialitate acoperă doar acest site. Pentru detalii despre cookie-uri, consimțământ și urmărire pe pagina de semnare, verifică politicile platformei ${site.signProvider}.`
          ]
        }
        : null,
      gaSection: {
        title: "Google Analytics (opțional)",
        items: [
          "Google Analytics este folosit doar pentru numărul de vizitatori și paginile vizitate.",
          "În configurația noastră trimitem date minime: fără semnale de publicitate și cu anonimizare IP.",
          "Nu cerem locația din browser. Datele geografice agregate sunt estimate de Google Analytics din trafic, dacă sunt disponibile.",
          "Poți activa separat trimiterea interacțiunilor pe site (click-uri), fără conținutul introdus în formulare."
        ]
      },
      noGaSection: {
        title: "Analytics terț dezactivat",
        items: [
          "În această implementare nu este activat niciun serviciu de analytics terț.",
          "Site-ul folosește doar stocare locală necesară funcțiilor de bază."
        ]
      }
    }
  },

  en: {
    locale: "en",
    localeName: "English",
    oppositeLocaleName: "Română",
    pathPrefix: "/en",
    tagline: "No verified identity, no enforceable remote loan.",
    homePath: "/en/",
    petitionPath: "/en/petition/",
    resourcesPath: "/en/resources/",
    privacyPath: "/en/privacy/",
    nav: [
      { type: "anchor", id: "problem", label: "The Problem" },
      { type: "anchor", id: "asks", label: "What We Ask" },
      { type: "anchor", id: "law", label: "Legal Basis" },
      { type: "anchor", id: "complaints", label: "Complaint templates" },
      { type: "anchor", id: "faq", label: "FAQ" },
      { type: "route", route: "resources", label: "Resources" },
      { type: "route", route: "petition", label: "Petition" },
    ],
    footer: {
      lead: "Civic campaign to update the legal framework governing remote loans and identity fraud.",
      note: "To protect personal data, we do not publish the full signed document on the site. When sharing the campaign, use the website link or a PDF with personal details removed.",
      legal: "Informational advocacy content. It is not individual legal advice.",
      sourceCode: hasSourceCodeConfig
        ? {
          intro: "For transparency, the source code is available on",
          linkLabel: site.sourceCodePlatform
        }
        : null,
      linksLabel: "Pages",
      links: [
        { label: "Home", route: "home" },
        { label: "Petition", route: "petition" },
        { label: "Resources", route: "resources" },
        { label: "Privacy", route: "privacy" },
      ],
    },
    share: {
      title: "Share the campaign",
      body: "Stolen data is not consent. We are calling for O.G. 85/2004 to be amended so that remote loans require robust identity verification.",
      button: "Share",
      copy: "Copy link",
      copied: "Link copied.",
      email: "Send by email",
    },
    labels: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      switchTo: "Română",
      skipToContent: "Skip to content",
      readSource: "Official source",
      readMore: "Details",
      updated: "Public web version optimized for sharing",
    },
    accessibility: {
      dockLabel: "Accessibility controls",
      privacyButton: "Privacy settings",
      fontLabel: "Font size",
      themeLabel: "Page theme",
      fontDecrease: "A-",
      fontReset: "A",
      fontIncrease: "A+",
      themeAuto: "Auto",
      themeLight: "Light",
      themeDark: "Dark",
      currentFontPrefix: "Text",
      privacySectionTitle: "Accessibility controls",
      privacySectionIntro: "You can quickly open privacy settings, adjust text size, and choose the page theme. By default, theme follows your browser setting."
    },
    home: {
      meta: {
        title: "Not In My Name - No verified identity, no enforceable remote loan",
        description: "Campaign to amend O.G. 85/2004: robust identity verification for online loans, suspension of enforcement in identity-fraud cases, and real consumer protection.",
        keywords: [
          "identity fraud",
          "remote loans",
          "Romania",
          "OG 85/2004",
          "ANPC",
          "identity verification",
          "consumer protection"
        ],
        ogImage: "/og/cover-en.png",
      },
      hero: {
        eyebrow: "Campaign to amend O.G. 85/2004",
        title: "Not In My Name.",
        subtitle: "No verified identity, no enforceable remote loan.",
        intro: "In Romania, a remote loan can trigger account freezes, enforcement, and negative credit reporting even when the real person never gave consent. We are calling for clear rules: robust identity verification before funds are disbursed, real protection for victims of identity fraud, and no enforceability when those checks were ignored.",
        chips: ["O.G. 85/2004", "O.U.G. 50/2010", "Law 129/2019", "RIL 23/2019"],
        primaryCta: { label: "Read the petition", route: "petition" },
        secondaryCta: { label: "Explore resources", route: "resources" },
        stats: [
          { value: "1", label: "core law to amend", note: "O.G. 85/2004" },
          { value: "6", label: "concrete safeguards", note: "from liveness to suspension of enforcement" },
          { value: "0", label: "cost for citizens", note: "free public information and templates" },
        ],
      },
      problem: {
        title: "Stolen data is not consent.",
        intro: "Identity fraud should never become enforceable debt. Yet the victim often bears the consequences first: frozen accounts, enforcement, stress, lost time, and legal costs just to prove they never asked for the loan.",
        cards: [
          {
            kicker: "01",
            title: "Compromised data",
            text: "A criminal can use copies of identity documents or leaked personal data to request online loans in someone else’s name."
          },
          {
            kicker: "02",
            title: "Remote contract logic",
            text: "In its current form, the law links contract formation to the confirmation received by the consumer, not to a robust technical identity check."
          },
          {
            kicker: "03",
            title: "Strong enforceability",
            text: "RIL 23/2019 reinforced the idea that a remote financial-services contract may be enforceable even without handwritten or advanced electronic signatures, unless the parties required a signature for validity."
          },
          {
            kicker: "04",
            title: "The victim fights after the damage",
            text: "In practice, the burden of stopping enforcement and proving the lack of real consent lands on the very person who should have been protected from the start."
          }
        ],
        timelineTitle: "How the legal gap looks in practice",
        timeline: [
          {
            title: "1. Personal data reaches a third party",
            text: "Through theft, a security breach, phishing, or abusive reuse of identity documents."
          },
          {
            title: "2. A remote loan is requested",
            text: "The digital flow continues without a robust, uniform and expressly mandatory identity-verification step."
          },
          {
            title: "3. The contract starts producing effects",
            text: "Funds are disbursed, negative reporting appears, or enforcement begins."
          },
          {
            title: "4. The real person has to repair the damage",
            text: "Only after the harm exists does the person begin fighting to prove that identity and intent were falsified."
          }
        ],
      },
      asks: {
        title: "Simple rules. Real protection.",
        intro: "This campaign is not asking to ban online lending. It is asking for online lending with verified identity, real consent, and effective protection for the victim.",
        cards: [
          {
            kicker: "A1",
            title: "Robust multi-factor verification",
            text: "A legal obligation before contract formation and before any funds are made available."
          },
          {
            kicker: "A2",
            title: "Biometric liveness + independent factor",
            text: "Identification should include liveness detection and at least one independent factor from another category."
          },
          {
            kicker: "A3",
            title: "No disbursement before verification",
            text: "Funds should not be released until the mandatory checks have been completed successfully."
          },
          {
            kicker: "A4",
            title: "No enforceability without minimum checks",
            text: "Contracts granted without the minimum safeguards should lose their enforceable effect."
          },
          {
            kicker: "A5",
            title: "Suspend enforcement and negative reporting",
            text: "A substantiated identity-fraud complaint should stop the damage temporarily until the case is clarified."
          },
          {
            kicker: "A6",
            title: "Keep logs and recordings",
            text: "Technical evidence of identification should be retained for at least 5 years and made available to authorities and courts."
          }
        ],
        compareTitle: "Today vs. after reform",
        compare: {
          beforeTitle: "Today",
          beforeItems: [
            "the speed of the digital flow can outweigh real verification of the person",
            "the victim quickly bears legal and financial consequences",
            "clarification happens only after the harm has appeared",
            "consumer protection is not tied strongly enough to the contract’s enforceable power"
          ],
          afterTitle: "After reform",
          afterItems: [
            "identity is checked technically and evidentially before any disbursement",
            "a contract without minimum safeguards cannot be used as an enforcement tool",
            "a substantiated complaint suspends enforcement and negative reporting",
            "the market remains digital, but with clear and verifiable standards"
          ]
        }
      },
      law: {
        title: "The legal pieces already exist. They need to be connected.",
        intro: "O.G. 85/2004, O.U.G. 50/2010 and Law 129/2019 already contain elements on consumer protection, pre-contract information and customer due diligence. The reform makes the bridge explicit between verified identity and the practical validity and enforceability of a remote loan contract.",
        cards: [
          {
            title: "O.G. 85/2004 - Articles 8, 23 and 24",
            summary: "Remote contract formation is linked to confirmation, ANPC is the competent authority, and the burden of proof regarding consent and information duties falls on the provider.",
            href: sharedLinks.en.og85,
            tag: "ANPC + consent"
          },
          {
            title: "RIL 23/2019",
            summary: "Romania’s High Court held that a remote financial-services contract may be enforceable even without handwritten or advanced electronic signatures, unless the parties made a signature a validity requirement.",
            href: sharedLinks.en.ril23,
            tag: "enforceability"
          },
          {
            title: "O.U.G. 50/2010 - pre-contract information",
            summary: "Creditors must provide timely pre-contract information on a durable medium so that consumers can make an informed decision.",
            href: sharedLinks.en.oug50,
            tag: "information"
          },
          {
            title: "Law 129/2019 - KYC and retention",
            summary: "Customer identity must be identified and verified through secure and independent sources, including remote identification processes accepted nationally, and records must be retained.",
            href: sharedLinks.en.law129,
            tag: "KYC"
          },
          {
            title: "O.G. 27/2002 - petition deadlines",
            summary: "Public authorities must answer petitions within 30 days, with a possible extension of up to 15 days where further inquiry is needed.",
            href: sharedLinks.en.og27,
            tag: "procedure"
          },
          {
            title: "EU context - AMLD and EBA",
            summary: "At EU level there is already a due-diligence, remote-onboarding and risk-control logic. The campaign asks for those standards to have clear effects in domestic consumer law as well.",
            href: sharedLinks.en.ebaRemote,
            tag: "EU framework"
          }
        ]
      },
      complaints: {
        title: "Personal complaint templates",
        intro: "Fill in your details and instantly generate a customized petition text that you can copy or send by email to Parliamentarians, Senators, the Chamber of Deputies, or Members of the European Parliament.",
        targetLabel: "Template for",
        memberFinder: {
          title: "Find official member lists",
          links: [
            { label: "Chamber of Deputies", href: sharedLinks.en.chamberMembers },
            { label: "Senate", href: sharedLinks.en.senateMembers },
            { label: "MEPs", href: sharedLinks.en.mepMembers }
          ]
        },
        targets: [
          { value: "parliamentarians", label: "Parliamentarians (RO)" },
          { value: "senators", label: "Senators (RO)" },
          { value: "deputies", label: "Chamber of Deputies (RO)" },
          { value: "meps", label: "MEPs (EN)" }
        ],
        fields: {
          name: "Full name",
          city: "City",
          county: "County",
          email: "Email",
          phone: "Phone",
          recipients: "Recipient emails (optional)"
        },
        placeholders: {
          name: "Example: Maria Ionescu",
          city: "Example: Bucharest",
          county: "Example: Ilfov",
          email: "Example: name@domain.com",
          phone: "Example: +40 7xx xxx xxx",
          recipients: "Example: mep1@ep.europa.eu, mep2@ep.europa.eu"
        },
        actions: {
          copySubject: "Copy subject",
          copyBody: "Copy text",
          email: "Open email"
        },
        output: {
          subject: "Email subject",
          body: "Petition text",
          emptySubject: "The subject is filled in automatically as you type.",
          emptyBody: "The petition text updates in real time while you type."
        },
        privacy: "Your data is never stored or sent to a server. Everything runs locally in your browser."
      },
      faq: {
        title: "Frequently asked questions",
        items: [
          {
            q: "Is this campaign against online lending?",
            a: "No. The campaign supports safe online lending. The core idea is simple: no verified identity, no enforceable effect against the real person."
          },
          {
            q: "Are you demanding only qualified electronic signatures?",
            a: "No. We are demanding robust multi-factor verification. A qualified signature can be one option, not the only one."
          },
          {
            q: "Why is ANPC central here?",
            a: "Because Article 23(2) of O.G. 85/2004 expressly places complaints and reports concerning distance financial contracts within ANPC’s competence."
          },
          {
            q: "What changes for victims?",
            a: "The goal is that victims are no longer enforced first and heard later. A substantiated complaint of identity theft or fraud should suspend enforcement and negative reporting until the case is checked."
          },
          {
            q: "Will you publish the signed document in full?",
            a: "No. The full signed document contains personal data, so we do not publish it in full. The website shows only the public version, without sensitive details."
          }
        ]
      },
      action: {
        title: "Three steps to turn the issue into real reform",
        cards: [
          {
            title: "Read the full petition",
            text: "The dedicated page brings together the executive summary, the technical proposal and the requests addressed to ANPC.",
            route: "petition",
            cta: "Open the petition"
          },
          {
            title: "Share the campaign",
            text: "Use the share button or copy the page link and send the message further.",
            action: "share",
            cta: "Share now"
          },
          {
            title: "Check the sources",
            text: "The resources page gathers the key laws, decisions and public articles about real-life cases.",
            route: "resources",
            cta: "Open resources"
          }
        ]
      }
    },
    petition: {
      meta: {
        title: "Petition to amend O.G. 85/2004",
        description: "Public petition summary for ANPC: robust identity verification, suspension of enforcement in fraud cases, and loss of enforceability where minimum safeguards are missing.",
        keywords: [
          "ANPC petition",
          "identity fraud",
          "remote loan",
          "Romania",
          "consumer protection"
        ],
        ogImage: "/og/cover-en.png",
      },
      hero: {
        eyebrow: "Public petition",
        title: "Campaign text for updating O.G. 85/2004",
        intro: "This page turns the technical letter addressed to ANPC into a public, easy-to-read and shareable version without personal data.",
        secondaryCta: { label: "View legal resources", route: "resources" },
      },
      summaryTitle: "Executive summary",
      summary: [
        "The petition starts from a real identity-fraud case and calls for O.G. 85/2004 to be updated so that remote lending is explicitly tied to robust technical identity verification.",
        "The core issue is the imbalance between the ease with which a remote contract can produce enforceable effects and the lack of a firm, uniform and auditable legal obligation to perform multi-factor identity checks before credit is granted.",
        "The solution does not prohibit online lending. It asks for mandatory safeguards, preserved technical evidence, and a procedural shield for the victim who reports identity fraud."
      ],
      sections: [
        {
          title: "What the petition asks for",
          items: [
            "a legal obligation to perform robust multi-factor identity verification before contract formation and before disbursement",
            "mandatory use of a biometric liveness factor and at least one additional independent factor",
            "a prohibition on disbursing funds before verification has been completed successfully",
            "loss of enforceability and invalidity of contrary clauses where minimum safeguards are missing",
            "suspension of enforcement and negative reporting when there is a substantiated complaint of identity theft or fraud",
            "retention for at least 5 years of the relevant logs and recordings"
          ]
        },
        {
          title: "Why ANPC",
          items: [
            "O.G. 85/2004 expressly places consumer complaints and reports concerning distance financial contracts within ANPC’s competence.",
            "The petition asks ANPC to assess the need for an urgent legislative amendment and to support related changes in other applicable acts.",
            "From a consumer-protection perspective, the intervention must be about valid consent, technical proof and a fast remedy, not only formal compliance."
          ]
        }
      ],
      proposalTitle: "Technical proposal to amend Article 8",
      proposalLead: "Below is a public and condensed version of the proposed legislative solution for remote credit contracts:",
      proposal: [
        {
          label: "(5)",
          text: "Before concluding the contract and before making funds available, the provider completes robust multi-factor identity verification of the client."
        },
        {
          label: "(5¹)",
          text: "Verification must include a biometric liveness factor and at least one additional independent factor from another category, together with documentary checks of the identity document and corroboration with lawful independent sources."
        },
        {
          label: "(6)",
          text: "Disbursement of funds is prohibited until the checks have been completed successfully."
        },
        {
          label: "(7)",
          text: "Failure to comply with the minimum obligations removes the contract’s enforceable effect and invalidates contrary clauses."
        },
        {
          label: "(8)",
          text: "Upon receipt of a substantiated complaint of identity theft or fraud, the provider suspends enforcement and negative reporting until internal checks are completed and gives a reasoned answer within a short timeframe."
        },
        {
          label: "(9)",
          text: "The provider retains logs, documents and technical recordings of the identification process for at least 5 years and makes them available to authorities and courts on request."
        },
        {
          label: "(10)",
          text: "Competent authorities issue technical rules on anti-spoofing, liveness performance, auditing and security testing."
        }
      ],
      requestsTitle: "Requests addressed to ANPC",
      requests: [
        "to register the petition and communicate the registration number, responsible unit and indicative response timeline",
        "to examine the opportunity for urgently amending O.G. 85/2004 in line with the technical proposal",
        "to support the necessary legislative alignment with O.U.G. 50/2010 and Law 129/2019",
        "to examine, from the perspective of professional diligence and unfair practices, how some providers currently verify identity in online-credit processes",
        "to communicate ANPC’s position in writing and, if steps are initiated, the indicative calendar"
      ],
      balanceTitle: "A firm but proportionate reform",
      balanceCards: [
        {
          title: "It does not block the digital market",
          text: "Remote lending remains possible, but it must be anchored in real technical identity verification."
        },
        {
          title: "It moves protection before the harm",
          text: "The remedy no longer appears only after enforcement; it starts at the moment the contractual relationship is formed."
        },
        {
          title: "It turns diligence into an auditable obligation",
          text: "The requirements become clear, testable and reviewable, not opaque internal practices."
        }
      ],
      sign: hasSignerProviderConfig
        ? {
          title: `Sign the petition on ${site.signProvider} platform`,
          intro: `We no longer collect personal information on this website. To sign, use the official ${site.signProvider} campaign page.`,
          cta: `Sign on ${site.signProvider} platform`,
          linkLabel: "Open signing page"
        }
        : null,
      privacyNote: "The site shows only the version without personal data. If you share a PDF, remove sensitive details first."
    },
    resources: {
      meta: {
        title: "Legal resources and press coverage on identity fraud in online lending",
        description: "Key laws, decisions and public reporting useful for the campaign to amend O.G. 85/2004.",
        keywords: [
          "legal resources",
          "identity fraud",
          "Romania",
          "remote lending",
          "consumer protection"
        ],
        ogImage: "/og/cover-en.png",
      },
      hero: {
        eyebrow: "Resources",
        title: "Legal basis, EU context and press coverage",
        intro: "This page groups the essential sources for understanding the problem and documenting the campaign."
      },
      groups: [
        {
          title: "Reported cases and investigations",
          items: [
            {
              title: "Snoop",
              text: "Investigation into the phenomenon of fake loans contracted with stolen identity documents.",
              href: sharedLinks.en.snoop,
              cta: "Read the article"
            },
            {
              title: "HotNews",
              text: "Case report about personal data used for financial products and loans without real consent.",
              href: sharedLinks.en.hotnews,
              cta: "Read the article"
            },
            {
              title: "Libertatea",
              text: "Concrete case involving personal data allegedly used abusively for illegal loans.",
              href: sharedLinks.en.libertatea,
              cta: "Read the article"
            },
            {
              title: "Știrile ProTV",
              text: "Example of online loans taken using someone else’s identity data and the effects that followed.",
              href: sharedLinks.en.protv,
              cta: "Read the article"
            }
          ]
        },
        {
          title: "Primary legal sources",
          items: [
            {
              title: "O.G. 85/2004",
              text: "The core act of the campaign. It covers the concept of financial services, the formation of distance contracts, ANPC’s competence, and the burden of proof on the provider.",
              href: sharedLinks.en.og85,
              cta: "Open the act"
            },
            {
              title: "High Court Decision (RIL) 23/2019",
              text: "The decision clarifying that a remote financial-services contract may be enforceable in certain conditions even without handwritten or advanced electronic signatures.",
              href: sharedLinks.en.ril23,
              cta: "Open the decision"
            },
            {
              title: "O.U.G. 50/2010",
              text: "Romania’s consumer-credit framework, including duties on timely pre-contract information provided on a durable medium.",
              href: sharedLinks.en.oug50,
              cta: "Open the act"
            },
            {
              title: "Law 129/2019",
              text: "Romania’s AML/KYC law requiring identification and verification from secure sources and retention of relevant records.",
              href: sharedLinks.en.law129,
              cta: "Open the act"
            },
            {
              title: "O.G. 27/2002",
              text: "Romania’s general petition framework for public authorities and institutions, including the response deadline.",
              href: sharedLinks.en.og27,
              cta: "Open the act"
            }
          ]
        },
        {
          title: "EU context",
          items: [
            {
              title: "AMLD - Directive (EU) 2015/849",
              text: "The European due-diligence basis for customer identification and anti-money-laundering obligations in the financial sector.",
              href: sharedLinks.en.amld,
              cta: "Open the directive"
            },
            {
              title: "EBA - Remote customer onboarding",
              text: "EBA guidance and materials on the use of remote onboarding solutions and the assessment of their adequacy.",
              href: sharedLinks.en.ebaRemote,
              cta: "Open the material"
            }
          ]
        }
      ],
      embed: {
        title: "Sticker for your website",
        intro: "If you want to support the campaign on your own website, use the snippet below to embed the official sticker.",
        previewLabel: "Not In My Name sticker preview",
        codeLabel: "Embed code (HTML)",
        copyCta: "Copy code"
      },
      calloutTitle: "How to use this page",
      calloutText: "For public sharing, the petition page and legal sources are enough. If you send supporting documents, remove personal data first."
    },
    consent: {
      title: "Privacy settings",
      bannerWithGa: "We use minimal traffic measurement to understand visitor count. You can choose whether to enable analytics.",
      bannerWithoutGa: "This site only uses strictly necessary local storage for core functionality (language, current section, consent state).",
      essentialTitle: "Essential storage",
      essentialDesc: "Required for core site functionality. Cannot be disabled.",
      analyticsTitle: "Visitor measurement (Google Analytics)",
      analyticsDesc: "Measures visitor count and page views.",
      interactionsTitle: "Website interactions (clicks, no content)",
      interactionsDesc: "Sends only the fact that you interacted with elements like navigation, copy actions, or form-field usage, without sending entered values.",
      alwaysOnLabel: "Always on",
      noGaSettingsNote: "No third-party analytics service is enabled in this deployment.",
      openSettings: "Privacy settings",
      acceptAll: "Accept all",
      rejectAll: "Reject optional",
      openPanel: "Customize",
      save: "Save settings",
      openPrivacyPage: "Privacy page",
      close: "Close"
    },
    privacy: {
      meta: {
        title: "Privacy and cookies",
        description: "How we use minimal data and how you can control privacy settings at any time.",
        keywords: [
          "privacy",
          "cookies",
          "GDPR settings",
          "minimal data"
        ],
        ogImage: "/og/cover-en.png",
      },
      hero: {
        eyebrow: "Privacy",
        title: "Minimal data, clear control",
        intro: "This page explains what data is used, why it is used, and how you can change your preferences anytime."
      },
      sections: [
        {
          title: "What we store as essential",
          items: [
            "your selected language",
            "your current section so you can return exactly where you left off",
            "your consent preferences"
          ]
        },
        {
          title: "What we do NOT enable by default",
          items: [
            "no analytics tracking before your consent",
            "no personalized advertising signals",
            "no unnecessary data collection beyond core functionality"
          ]
        }
      ],
      signProviderNotice: hasSignerProviderConfig
        ? {
          title: `${site.signProvider} signing platform`,
          items: [
            `When you open the external ${site.signProvider} signing page, cookies and similar technologies on that page are controlled by ${site.signProvider} platform, not by this site.`,
            `Our privacy policy applies only to this website. For cookie, consent and tracking details on the signing page, check ${site.signProvider}'s policies.`
          ]
        }
        : null,
      gaSection: {
        title: "Google Analytics (optional)",
        items: [
          "Google Analytics is used only to measure visitor count and visited pages.",
          "Our setup sends minimal data: no ad signals and anonymized IP.",
          "We do not request browser location. Aggregated geographic insights are estimated by Google Analytics from traffic signals when available.",
          "You can separately enable sharing website interactions (clicks) without any form content."
        ]
      },
      noGaSection: {
        title: "Third-party analytics disabled",
        items: [
          "No third-party analytics service is enabled in this deployment.",
          "The site only uses local storage needed for core functionality."
        ]
      }
    }
  }
};

export const pageOrder = [
  { locale: "ro", type: "home", route: "/" },
  { locale: "ro", type: "petition", route: "/petition/" },
  { locale: "ro", type: "resources", route: "/resources/" },
  { locale: "ro", type: "privacy", route: "/privacy/" },
  { locale: "en", type: "home", route: "/en/" },
  { locale: "en", type: "petition", route: "/en/petition/" },
  { locale: "en", type: "resources", route: "/en/resources/" },
  { locale: "en", type: "privacy", route: "/en/privacy/" },
];
