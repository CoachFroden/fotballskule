const ANSVARLIG_KODE = "2026";

let ansvarligInnlogget = false;
let sisteAktivitet = 0;

const TIMEOUT_MINUTTER = 5;

const db = firebase.firestore();
let attendanceListener = null;
let overviewListener = null;

const instructors = [
  { navn: "Adele Liøen Tveiterås", gruppe: 2, telefon: "929 99 350", epost: "adelelioen@icloud.com" },
  { navn: "Ask Aldal", gruppe: 5, telefon: "", epost: "asknaldal@gmail.com" },
  { navn: "Christina Gjerde Markhus", gruppe: 1, telefon: "", epost: "" },
  { navn: "Eirik Matland Østerås", gruppe: 5, telefon: "969 21 546", epost: "" },
  { navn: "Emely Ulevik", gruppe: 3, telefon: "913 75 892", epost: "emely.ulevik@icloud.com" },
  { navn: "Ida Gjerde Skulstad", gruppe: 5, telefon: "929 85 571", epost: "" },
  { navn: "Lars Frøland", gruppe: 3, telefon: "906 55 065", epost: "" },
  { navn: "Leander Koldal", gruppe: 1, telefon: "973 10 569", epost: "" },
  { navn: "Liam M Liøen", gruppe: 4, telefon: "", epost: "liammlioen@icloud.com" },
  { navn: "Liva Skår Foss", gruppe: 4, telefon: "", epost: "" },
  { navn: "Louise Trengereid", gruppe: 2, telefon: "973 09 613", epost: "louise.trenge@gmail.com" },
  { navn: "Madelen Vatle", gruppe: 2, telefon: "466 32 292", epost: "" },
  { navn: "Magnus Erichsen-Hovland", gruppe: 2, telefon: "413 13 143", epost: "magnusditto@gmail.com" },
  { navn: "Matas Zdancius", gruppe: 3, telefon: "413 25 402", epost: "matas41528@gmail.com" },
  { navn: "Mats Brugrand", gruppe: 4, telefon: "405 11 738", epost: "" },
  { navn: "Nathalie Langeland Drevsjø", gruppe: 1, telefon: "458 89 280", epost: "" },
  { navn: "Nora Liøen Tveiterås", gruppe: 5, telefon: "929 97 702", epost: "noralioen@icloud.com" },
  { navn: "Sigurd Øien", gruppe: "5 (tirsdag)", telefon: "991 02 706", epost: "sigurdoien@icloud.com" },
  { navn: "Snorre Naalsund Aldal", gruppe: 3, telefon: "", epost: "snorrealdal@gmail.com" },
  { navn: "Thage Haukenes", gruppe: 4, telefon: "", epost: "thagehaukenes@gmail.com" },
  { navn: "William Hisdal Haga", gruppe: 1, telefon: "920 84 460", epost: "williamhh2010@icloud.com" }
];

const participants = [
  { navn: "Markus Bjørkmo", gruppe: 1, fodselsar: 2019, tshirt: "128-137cm", allergi: "", foresatt:"" },
  { navn: "Jakob Thoresen", gruppe: 1, fodselsar: 2019, tshirt: "128-137cm", allergi: "Melkeprotein, egg, nøtter, hvete" , foresatt:""},
  { navn: "Einar Ingvartsen Holmefjord", gruppe: 1, fodselsar: 2019, tshirt: "128-137cm", allergi: "" , foresatt:""},
  { navn: "Isak Langeland", gruppe: 1, fodselsar: 2019, tshirt: "128-137cm", allergi: "" , foresatt:""},
  { navn: "Olav Hadeland Thieme", gruppe: 1, fodselsar: 2019, tshirt: "128-137cm", allergi: "" , foresatt:""},
  { navn: "Jonas Clark", gruppe: 1, fodselsar: 2019, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Håkon Blomvågnes", gruppe: 1, fodselsar: 2019, tshirt: "137-147cm", allergi: "" },
  { navn: "Nathaniel Hisdal Børve", gruppe: 1, fodselsar: 2019, tshirt: "128-137cm", allergi: "" , foresatt:""},
  { navn: "Samuel Frøland", gruppe: 1, fodselsar: 2018, tshirt: "128-137cm", allergi: "" , foresatt:""},
  { navn: "Olai Byrkjeland Nilsen", gruppe: 1, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Johannes Fossmark Haugsbø", gruppe: 1, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Lavrans Langeland", gruppe: 1, fodselsar: 2018, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Evo Risnes Skår", gruppe: 1, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Leo Emiil Davanger", gruppe: 1, fodselsar: 2018, tshirt: "128-137cm", allergi: "" , foresatt:""},

  { navn: "Max Foss-Reistad", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Emil Ingvartsen Holmefjord", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Oda Tømmerbakk", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "Melk" , foresatt:""},
  { navn: "Noomi Skår Foss", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Eryk Bucki", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Tobias Vinje Våge", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "", foresatt: "Frode Vinje Våge (far) - 909 94 861 / Vibeke Vinje Våge (mor) - 412 94 850"},
  { navn: "Ylva Fossdal Moe", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Liva Aa. Morskogen", gruppe: 2, fodselsar: 2018, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Mikkel Stavnes Hisdal", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Isak Jørgensen Vikøy", gruppe: 2, fodselsar: 2018, tshirt: "128-137cm", allergi: "" , foresatt:""},
  { navn: "Iselin Utskot", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Linus Liøen", gruppe: 2, fodselsar: 2018, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Thomas Tømmerbakk Erstad", gruppe: 2, fodselsar: 2018, tshirt: "128-137cm", allergi: "" , foresatt:""},

  { navn: "Theo Høysæter Svendsen", gruppe: 3, fodselsar: 2017, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Ariel Arnatveit Aldal", gruppe: 3, fodselsar: 2017, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Aksel Karenius Hope", gruppe: 3, fodselsar: 2017, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Nicholas Langeland Drevsjø", gruppe: 3, fodselsar: 2017, tshirt: "147-158cm", allergi: "Peanøttallergi" , foresatt:""},
  { navn: "Olav Lønnindal Frøland", gruppe: 3, fodselsar: 2017, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Oskar Clark", gruppe: 3, fodselsar: 2017, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Augustin Hope", gruppe: 3, fodselsar: 2016, tshirt: "128-137cm", allergi: "" , foresatt:""},
  { navn: "Linus Jørgensen Koldal", gruppe: 3, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Even Tømmerbakk", gruppe: 3, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Dennis Knapskaug", gruppe: 3, fodselsar: 2016, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Lara Risnes Skår", gruppe: 3, fodselsar: 2016, tshirt: "147-158cm", allergi: "Nøtter inkludert spor av nøtter" , foresatt:""},
  { navn: "Nelly Vik", gruppe: 3, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Vincent Øpstad-Gjerde", gruppe: 3, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Sindre Odland", gruppe: 3, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Mykhailo Stoianov", gruppe: 3, fodselsar: 2016, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Julia Bruvik", gruppe: 3, fodselsar: 2016, tshirt: "137-147cm", allergi: "" , foresatt:""},
  { navn: "Ingrid Haugsbø Fossmark", gruppe: 3, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Viljar Blomvågnes", gruppe: 3, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},

  { navn: "Viktor Johan Hope", gruppe: 4, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Filip Fossdal Moe", gruppe: 4, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Viktoria Ask Uglehus", gruppe: 4, fodselsar: 2016, tshirt: "147-158cm", allergi: "Laktose" , foresatt:""},
  { navn: "Melvin Allaskog Teige", gruppe: 4, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Isabelle H. Øystese", gruppe: 4, fodselsar: 2016, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Iver Erstad", gruppe: 4, fodselsar: 2016, tshirt: "147-158cm", allergi: "Egg og nøtter" , foresatt:""},
  { navn: "Oskar Tømmerbakk Erstad", gruppe: 4, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Olea Aa. Morskogen", gruppe: 4, fodselsar: 2016, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Elida Risnes Skår", gruppe: 4, fodselsar: 2016, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Even Hadeland Thieme", gruppe: 4, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Sened Debrom Tesfamichael", gruppe: 4, fodselsar: 2015, tshirt: "147-158cm", allergi: "Laktoseintoleranse" , foresatt:""},
  { navn: "Sebastian Nytveit", gruppe: 4, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Ylva Jonathanson", gruppe: 4, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Sebastian Mæhle Thoresen", gruppe: 4, fodselsar: 2015, tshirt: "147-158cm", allergi: "Egg og nøtter" , foresatt:""},
  { navn: "Ulrik Arnatveit Aldal", gruppe: 4, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Ingrid Litangen -Skår", gruppe: 4, fodselsar: 2015, tshirt: "158-170cm", allergi: "", foresatt: "Anne-Gro Litangen (mor) - 408 44 138" },
  { navn: "Samuel Bjørkmo", gruppe: 4, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Emmelie Klette", gruppe: 4, fodselsar: 2015, tshirt: "158-170cm", allergi: "" , foresatt:""},

  { navn: "Ada Sofie Tysse-Magnesen", gruppe: 5, fodselsar: 2015, tshirt: "158-170cm", allergi: "Laktoseintoleranse" , foresatt:""},
  { navn: "Mari Frøland", gruppe: 5, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Ariel Byrkjeland Nilsen", gruppe: 5, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Sofija Antic", gruppe: 5, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Isrid Flaa", gruppe: 5, fodselsar: 2015, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Nora Elen Lægland Haugen", gruppe: 5, fodselsar: 2014, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Anna Moss Liøen", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Ella Konstanse Hope", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Alina Skår Foss", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Theo Jørgensen Vikøy", gruppe: 5, fodselsar: 2014, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Viktoria Bruvik", gruppe: 5, fodselsar: 2014, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Trym Brugrand", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Melissa Totland", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Vegard Skutlaberg", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Ludvig Johan Solberg", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Lisa tveit nævdal", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Oliver Gjerde Skulstad", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Lea Emilie Davanger", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Oline Matland Østerås", gruppe: 5, fodselsar: 2014, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Marcus Herland Fonn", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Johannes Steinsland Henriksen", gruppe: 5, fodselsar: 2014, tshirt: "147-158cm", allergi: "" , foresatt:""},
  { navn: "Jonathan Tømmerbakk Erstad", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Elias langeland", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Tilde Hofsø Steinsland", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Sofie Skarsbø", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Samuel Hisdal Haga", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Andrine Ask Uglehus", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Marta Oldervoll", gruppe: 5, fodselsar: 2014, tshirt: "158-170cm", allergi: "" , foresatt:""},
  { navn: "Andreas Fylkesnes", gruppe: 5, fodselsar: 2015, tshirt: "158-170cm", allergi: "Drikk ikkje melk men går fint med litt yoghurt." , foresatt:""}
];

const exercises = [

{
    id: "haien",
    navn: "Haien kommer",
    grupper: "1-3",

    oppsett: `
    Lag en firkant på omtrent 20 x 20 meter.
    Alle spillerne har hver sin ball.
    Velg 1–2 haier som starter uten ball.
    `,

    forklaring: `
    Alle spillerne fører ballen rundt inne i firkanten.
    Haiene prøver å sparke ballene ut av området.
    Mister en spiller ballen sin ut av firkanten, blir han eller hun også hai.
    Øvelsen fortsetter til det bare er én spiller igjen med ball.
    `,

    fokus: `
    Mange små touch på ballen.
    Blikk opp slik at spillerne ser ledig plass.
    Vendinger når de møter andre spillere.
    `,

    tips: `
    Start med én hai.
    Legg til flere haier dersom det blir for lett.
    `
},

{
    id: "trafikklys",
    navn: "Trafikklys",
    grupper: "1-2",

    oppsett: `
    Lag en firkant på omtrent 20 x 20 meter.
    Alle spillerne har hver sin ball.
    `,

    forklaring: `
    Spillerne fører ballen rundt i firkanten.
    Instruktøren roper ulike kommandoer:
    Grønn = full fart.
    Gul = rolig fart.
    Rød = stopp med sålen på ballen.
    U-sving = vending og motsatt retning.
    Turbo = så fort som mulig.
    `,

    fokus: `
    Kontroll på ballen.
    Raske reaksjoner.
    Bruk av begge bein.
    `,

    tips: `
    Bytt kommando ofte.
    Prøv å lure spillerne innimellom for å holde konsentrasjonen oppe.
    `
},

{
    id: "skattejakt",
    navn: "Skattejakt",
    grupper: "1-2",

    oppsett: `
    Del spillerne inn i lag.
    Legg mange baller eller kjegler i midten som skatt.
    Hvert lag har sitt eget skattekammer.
    `,

    forklaring: `
    Når instruktøren starter øvelsen, løper spillerne til midten.
    De kan bare hente én skatt om gangen.
    Skatten føres tilbake til lagets område.
    Når alle skattene er hentet teller lagene hvor mange de har samlet.
    `,

    fokus: `
    Føring med kontroll.
    Holde ballen nær kroppen.
    Orientering.
    `,

    tips: `
    Bruk baller, kjegler eller vester som skatt.
    `
},

{
    id: "kongen",
    navn: "Kongen av ringen",
    grupper: "2-4",

    oppsett: `
    Lag en firkant.
    Alle spillerne har hver sin ball.
    `,

    forklaring: `
    Spillerne skal beskytte sin egen ball.
    Samtidig prøver de å sparke ut de andre sine baller.
    Hvis ballen går ut av området må spilleren utføre en liten oppgave før han eller hun kommer inn igjen.
    `,

    fokus: `
    Skjerming av ball.
    Bruk av kroppen.
    Vendinger bort fra press.
    `,

    tips: `
    Målet er høy aktivitet.
    Ikke la spillere stå lenge utenfor.
    `
},

{
    id: "sjorover",
    navn: "Sjørøver",
    grupper: "2-4",

    oppsett: `
    Alle spillerne har hver sin ball inne i en firkant.
    `,

    forklaring: `
    Alle er sjørøvere som skal passe på sin egen skatt.
    Samtidig prøver de å stjele de andre sine skatter.
    Mister du ballen må du hente den og fortsette.
    `,

    fokus: `
    Føring med kontroll.
    Skjerming.
    Raske vendinger.
    `,

    tips: `
    Oppmuntre spillerne til å bruke kroppen for å beskytte ballen.
    `
},

{
    id: "cowboy",
    navn: "Cowboy og indianer",
    grupper: "2-4",

    oppsett: `
	Lag en firkant.
    Indianerne har hver sin ball inne i firkanten.
    Cowboyene står utenfor med baller.
    `,

    forklaring: `
    Indianerne fører ballen rundt i området.
    Cowboyene prøver å treffe indianernes baller med sine egne baller.
    Treffer de får cowboyene poeng.
    Bytt roller etter en stund.
    `,

    fokus: `
    Føring med kontroll.
    Blikk opp.
    Retningsforandringer.
    `,

    tips: `
    Bytt roller ofte.
    `
},

{
    id: "pasningsstafett",
    navn: "Pasningsstafett",
    grupper: "2-4",

    oppsett: `
    Del inn i lag på 3–5 spillere.
	Start på en linje eller et merke.
    Sett opp tre merker forover med en meter fra hverandre.
    `,

    forklaring: `
	Lagene stiller seg opp i rekker bak linjen eller merket.
    Første spiller tar ballen med seg til første merke, løper tilbake uten ball.
    Deretter løper spilleren ut igjen og tar ballen med seg til neste merke osv.
	Når han har løpt tilbake og ut igjen til siste merke, skal han sentre til neste på laget.
    Laget som fullfører først vinner.
    `,

    fokus: `
    Presise pasninger.
    Førsteberøring.
    Tempo.
    `,

    tips: `
    Gjør avstanden lengre dersom det blir for enkelt.
    `
},

{
    id: "nummerduell",
    navn: "Nummerduell",
    grupper: "3-5",

    oppsett: `
    Del spillerne inn i to lag.
    Lagene står på hver sin side av banen.
	Ha ett lite mål på hver side.
    Alle får hvert sitt nummer.
    `,

    forklaring: `
    Instruktøren roper et nummer.
    De to spillerne med det nummeret løper inn.
    Instruktøren spiller inn en ball.
    Første spiller til å score vinner duellen.
    `,

    fokus: `
    Reaksjon.
    Hurtighet.
    1 mot 1-ferdigheter.
    `,

    tips: `
    Rop flere nummer for 2 mot 2 eller 3 mot 3.
    `
},

{
    id: "portduell",
    navn: "1 mot 1 gjennom port",
    grupper: "3-5",

    oppsett: `
    Lag små baner med porter i hver ende.
    En spiller på hvert lag.
    `,

    forklaring: `
    Spillerne møter hverandre 1 mot 1.
    Det scores ved å føre ballen kontrollert gjennom en port.
    `,

    fokus: `
    Finter.
    Retningsforandringer.
    Forsvarsspill.
    `,

    tips: `
    Oppmuntre spillerne til å utfordre motspilleren.
    `
},

{
    id: "knockout",
    navn: "Knockout",
    grupper: "3-5",

    oppsett: `
    En keeper i mål.
    Resten av spillerne står på rekke et stykke fra mål.
	En instruktør står med ballene ved siden av målet.
    `,

    forklaring: `
	Instruktøren sentrer ut til første spiller som skyter på dirketen på mål.
    Scorer spilleren går han bak i rekka, keeperen er ute, og neste spiller i rekka må i mål.
    Bom eller redning betyr at spilleren går i mål og keeperen går bakerst i rekka.
    Siste spiller som står igjen uten å bli ute vinner.
    `,

    fokus: `
    Avslutninger.
    Presisjon.
    Hurtige avslutninger.
    `
},

{
    id: "Verdensmester",
    navn: "Verdensmester",
    grupper: "4-5",

    oppsett: `
    Sett opp flere små baner ved siden av hverandre med nummer.
    Spill 1 mot 1 eller 2 mot 2.
	Trekk om hvem som starter på hvilken bane, eller instruktører bestemmer.
	Spill 10 runder.
    `,

    forklaring: `
    Vinnerlaget rykker opp én bane.
    Taperlaget rykker ned én bane.
    Målet er å vinne siste kamp på bane 1 og bli verdensmester.
    `,

    fokus: `
    Konkurranse.
    Intensitet.
    Mestring.
    `,

    tips: `
    Korte kamper på 2–3 minutter fungerer best.
    `
},

{
    id: "innlegg",
    navn: "Innlegg og avslutning",
    grupper: "4-5",

    oppsett: `
    En spiller på kant.
    En eller to spillere foran mål.
    Keeper i mål.
    `,

    forklaring: `
    Kantspilleren fører eller mottar ball.
    Deretter slås innlegg inn i feltet.
    Angriperne avslutter på mål.
    `,

    fokus: `
    Timing på løp.
    Innlegg.
    Avslutning.
    `,

    tips: `
    Varier mellom lave og høye innlegg.
    `
},

{
    id: "ti_pasninger",
    navn: "Ti pasninger",
    grupper: "2-5",

    oppsett: `
    To lag i en firkant.
    En ball i spill.
    `,

    forklaring: `
    Laget får poeng når de klarer ti sammenhengende pasninger.
    Motstanderne prøver å bryte
    Mister laget ballen starter tellingen på nytt.
	Bytt lag etter en stund.
    `,

    fokus: `
    Pasningsspill.
    Bevegelse.
    Samspill.
    `
},

{
    id: "firemal",
    navn: "Fire mål",
    grupper: "2-5",

    oppsett: `
    Firkant med ett lite mål i hvert hjørne.
    To lag spiller mot hverandre.
    `,

    forklaring: `
    Lagene kan score i alle målene.
    Spillerne må orientere seg og velge hvor det er enklest å angripe.
    `,

    fokus: `
    Orientering.
    Valg.
    Samspill.
    `
},

{
    id: "turnering",
    navn: "Mini-turnering",
    grupper: "1-5",

    oppsett: `
    Flere små baner.
    Lag på 3 mot 3 eller 4 mot 4.
    `,

    forklaring: `
    Spill korte kamper på 4–5 minutter.
    Roter motstandere mellom hver kamp.
    Hold høy aktivitet og korte pauser.
    `,

    fokus: `
    Spilleglede.
    Mange ballberøringer.
    Samspill.
    `
}

];

function showInstructorInfo() {

  document.getElementById("mainMenu").innerHTML = `
    <button class="menu-button" onclick="showInstructorPage('ovelser')">
      Øvelser
    </button>

    <button class="menu-button" onclick="showInstructorPage('krysselister')">
      Krysselister
    </button>

    <button class="menu-button" onclick="showInstructorPage('instrukser')">
      Instrukser
    </button>
	
	<button class="menu-button" onclick="showInstructorPage('grupper')">
      Grupper
    </button>
	
	<button class="menu-button" onclick="showInstructorPage('tilbakemelding')">
      Tilbakemelding
    </button>
  `;

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Instruktører</h2>
      <p>Velg ein av knappane over.</p>
    </div>
  `;
}

function showInstructorPage(page) {

if (page === "ovelser") {

  let html = "";

  exercises.forEach(exercise => {

    html += `
  <div class="exercise-card" onclick="showExercise('${exercise.id}')">
    <h3>${exercise.navn}</h3>
    <p>Passer best for gruppe ${exercise.grupper}</p>
  </div>
`;

  });

  document.getElementById("content").innerHTML = `
  <div class="welcome-box">
    <h2>Øvelser</h2>
    <p>Velg en øvelse under.</p>

    <div class="exercise-list">
      ${html}
    </div>
  </div>
`;

  return;
}

  if (page === "krysselister") {
    document.getElementById("mainMenu").innerHTML = `
      <button class="menu-button" onclick="showAttendanceList(1)">Gruppe 1</button>
      <button class="menu-button" onclick="showAttendanceList(2)">Gruppe 2</button>
      <button class="menu-button" onclick="showAttendanceList(3)">Gruppe 3</button>
      <button class="menu-button" onclick="showAttendanceList(4)">Gruppe 4</button>
      <button class="menu-button" onclick="showAttendanceList(5)">Gruppe 5</button>
    `;

    document.getElementById("content").innerHTML = `
      <div class="welcome-box">
        <h2>Krysselister</h2>
        <p>Velg gruppe over.</p>
      </div>
    `;
    return;
  }

  if (page === "instrukser") {
document.getElementById("content").innerHTML = `
<div class="welcome-box">

<h2>⚽ Instruktørinstruksar</h2>

<h3>Før gruppa kjem</h3>
<p>
• Møt opp i god tid.<br>
• Sjekk kva gruppe du skal ha.<br>
• Finn fram nødvendig utstyr.<br>
• Avtal kven som tek opprop.
</p>

<h3>Oppstart av gruppa</h3>
<p>
• Ta opprop.<br> 
• Presenter dykk som instruktørar.<br>
• Fortel kort kva som skal skje denne dagen.<br>
• Sjekk at alle har fotballsko og leggskinn.<br>
• På dag 2 og 3 kan du spørje om dei hugsar noko frå dagen før.<br>
• Start raskt med aktivitet.Velg blant øvelsene eller finn på eigne.
</p>

<h3>Under øktene</h3>
<p>
• Ver positiv og inkluderande.<br>
• Snakk med alle deltakarane.<br>
• Ros innsats og forsøk.<br>
• Hjelp dei som synest noko er vanskeleg.<br>
• Hald aktiviteten i gang.<br>
• Ingen skal stå lenge i kø.
</p>

<h3>Dersom nokon blir lei seg eller skadar seg</h3>
<p>
• Ta deg tid til å snakke med barnet.<br>
• Meld frå til ein ansvarleg vaksen dersom du er usikker.<br>
• Ingen barn skal gå aleine frå gruppa.
</p>

<h3>Etter lunsj</h3>
<p>
• Ta nytt opprop.<br>
• Presenter dykk dersom gruppa har fått nye instruktørar.<br>
• Start med ei enkel øving i 15–20 minutt.<br>
• Del deretter inn i lag og spel kampar resten av økta, eller gjer øvelser.
</p>

<h3>Avslutting av dagen</h3>
<p>
• Samle gruppa før dei går heim.<br>
• Takk for innsatsen og den gode dagen.<br>
• Fortel kort kva som skal skje neste dag.<br>
• Rydd saman utstyr før du går.
</p>

<h3>⭐ Det viktigaste av alt</h3>
<p>
Målet med fotballskulen er ikkje å vinne kampar eller gjennomføre flest mogleg øvelsar.
</p>

<p>
⚽ Alle skal ha det kjekt<br>
⚽ Alle skal oppleve meistring<br>
⚽ Alle skal bli inkluderte<br>
⚽ Alle skal få nye vennskap<br>
⚽ Alle skal gå heim med lyst til å spele meir fotball
</p>

</div>
`;
    return;
  }
  
  if (page === "grupper") {

  let html = "";

  for (let gruppe = 1; gruppe <= 5; gruppe++) {

    const gruppeInstruktorer = instructors.filter(i =>
      String(i.gruppe).startsWith(String(gruppe))
    );

    html += `
      <div class="instruction-section">
        <h3>Gruppe ${gruppe}</h3>

        <ul>
          ${gruppeInstruktorer.map(i => `<li>${i.navn}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">

      <h2>Instruktørgrupper</h2>

      <p>
        Oversikt over kven som er på dei forskjellige gruppene
      </p>

      ${html}

    </div>
  `;

  return;
}
if (page === "tilbakemelding") {
  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>📝 Anonym tilbakemelding</h2>

      <p>
        Tilbakemeldinga er anonym og blir brukt for å gjere fotballskulen betre neste år.
        Skriv gjerne både det som var bra og det som kan bli betre.
      </p>

      <h3>Korleis trivdest du som instruktør?</h3>
      <select id="trivsel">
        <option value="">Velg</option>
        <option value="5">5 - Veldig bra</option>
        <option value="4">4 - Bra</option>
        <option value="3">3 - Greitt</option>
        <option value="2">2 - Mindre bra</option>
        <option value="1">1 - Dårlig</option>
      </select>

      <h3>Korleis fungerte appen?</h3>
      <select id="app">
        <option value="">Velg</option>
        <option value="5">5 - Veldig bra</option>
        <option value="4">4 - Bra</option>
        <option value="3">3 - Greitt</option>
        <option value="2">2 - Mindre bra</option>
        <option value="1">1 - Dårlig</option>
      </select>

      <h3>Korleis fungerte øvelsane?</h3>
      <select id="ovelserFeedback">
        <option value="">Velg</option>
        <option value="5">5 - Veldig bra</option>
        <option value="4">4 - Bra</option>
        <option value="3">3 - Greitt</option>
        <option value="2">2 - Mindre bra</option>
        <option value="1">1 - Dårlig</option>
      </select>

      <h3>Fekk du nok informasjon og støtte?</h3>
      <select id="stotte">
        <option value="">Velg</option>
        <option value="5">5 - Veldig bra</option>
        <option value="4">4 - Bra</option>
        <option value="3">3 - Greitt</option>
        <option value="2">2 - Mindre bra</option>
        <option value="1">1 - Dårlig</option>
      </select>

      <h3>Kva fungerte spesielt bra?</h3>
      <textarea id="bra" class="feedback-text"></textarea>

      <h3>Kva kan vi gjere betre neste år?</h3>
      <textarea id="bedre" class="feedback-text"></textarea>

      <h3>Har du forslag til nye øvelser?</h3>
      <textarea id="forslag" class="feedback-text"></textarea>

      <h3>Vil du vere instruktør igjen neste år?</h3>
      <select id="igjen">
        <option value="">Velg</option>
        <option value="Ja">Ja</option>
        <option value="Kanskje">Kanskje</option>
        <option value="Nei">Nei</option>
      </select>

      <br><br>

      <button class="menu-button" onclick="sendFeedback()">
        Send tilbakemelding
      </button>

      <p id="feedbackStatus"></p>
    </div>
  `;

  return;
}
}

function showExercise(id) {

  const exercise = exercises.find(e => e.id === id);

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">

      <h2>${exercise.navn}</h2>

      <p><strong>Passer for gruppe:</strong> ${exercise.grupper}</p>

      <h3>Oppsett</h3>
      <p>${exercise.oppsett}</p>

      <h3>Slik forklarer du øvelsen</h3>
      <p>${exercise.forklaring}</p>

      <h3>Fokus</h3>
      <p>${exercise.fokus}</p>

    </div>
  `;
}

function showAttendanceList(group) {
  document.getElementById("mainMenu").innerHTML = `
    <button class="menu-button" onclick="showAttendanceSession(${group}, 'man_for')">Måndag<br>før lunsj</button>
<button class="menu-button" onclick="showAttendanceSession(${group}, 'man_etter')">Måndag<br>etter lunsj</button>

<button class="menu-button" onclick="showAttendanceSession(${group}, 'tir_for')">Tysdag<br>før lunsj</button>
<button class="menu-button" onclick="showAttendanceSession(${group}, 'tir_etter')">Tysdag<br>etter lunsj</button>

<button class="menu-button" onclick="showAttendanceSession(${group}, 'ons_for')">Onsdag<br>før lunsj</button>
<button class="menu-button" onclick="showAttendanceSession(${group}, 'ons_etter')">Onsdag<br>etter lunsj</button>
  `;

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Gruppe ${group}</h2>
      <p>Velg tidspunkt for avkryssing.</p>
    </div>
  `;
}

async function showAttendanceSession(group, session) {
  const labels = {
    man_for: "Måndag før lunsj",
    man_etter: "Måndag etter lunsj",
    tir_for: "Tysdag før lunsj",
    tir_etter: "Tysdag etter lunsj",
    ons_for: "Onsdag før lunsj",
    ons_etter: "Onsdag etter lunsj"
  };

  const groupParticipants = participants.filter(p => p.gruppe === group);

  let list = "";

  groupParticipants.forEach(p => {
    const id = makeId(p.navn);

    list += `
      <label class="attendance-card">
        <span>${p.navn}</span>
        <input type="checkbox"
               id="${id}_${session}"
               onchange="saveAttendance('${id}', ${group}, '${session}', this.checked)">
      </label>
    `;
  });

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Gruppe ${group}</h2>
      <h3>${labels[session]}</h3>

      <p id="attendanceCounter" class="attendance-counter">
        0 / ${groupParticipants.length} møtt
      </p>

      <div class="attendance-list">
        ${list}
      </div>
    </div>
  `;

  loadAttendanceSession(groupParticipants, group, session);
}

function loadAttendanceSession(groupParticipants, group, session) {

  if (attendanceListener) {
    attendanceListener();
  }

  attendanceListener = db.collection("fotballskule2026")
    .doc("krysselister")
    .collection("gruppe" + group)
    .onSnapshot(snapshot => {

      snapshot.forEach(doc => {
        const data = doc.data();
        const id = doc.id;

        const checkbox = document.getElementById(`${id}_${session}`);

        if (checkbox) {
          checkbox.checked = data[session] === true;
        }
      });

      updateAttendanceCounter(groupParticipants, session);
    });
}

function updateAttendanceCounter(groupParticipants, session) {
  let checked = 0;

  groupParticipants.forEach(p => {
    const id = makeId(p.navn);
    const checkbox = document.getElementById(`${id}_${session}`);
    if (checkbox && checkbox.checked) checked++;
  });

  const counter = document.getElementById("attendanceCounter");
  if (counter) {
    counter.textContent = `${checked} / ${groupParticipants.length} møtt`;
  }
}

function makeId(name) {
  return name
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll(".", "")
    .replaceAll("-", "_")
    .replaceAll("æ", "ae")
    .replaceAll("ø", "o")
    .replaceAll("å", "a");
}

async function saveAttendance(id, group, day, checked) {
  await db.collection("fotballskule2026")
    .doc("krysselister")
    .collection("gruppe" + group)
    .doc(id)
    .set({ [day]: checked }, { merge: true });

  const session = day;
  const groupParticipants = participants.filter(p => p.gruppe === group);
  updateAttendanceCounter(groupParticipants, session);
}

async function loadAttendance(groupParticipants, group) {
  for (const p of groupParticipants) {
    const id = makeId(p.navn);

    const doc = await db.collection("fotballskule2026")
      .doc("krysselister")
      .collection("gruppe" + group)
      .doc(id)
      .get();

    if (doc.exists) {
      const data = doc.data();

      ["man_for", "man_etter", "tir_for", "tir_etter", "ons_for", "ons_etter"].forEach(day => {
        const checkbox = document.getElementById(`${id}_${day}`);
        if (checkbox) checkbox.checked = data[day] === true;
      });
    }
  }
}

function showResponsibleMenu() {

  const no = Date.now();

  if (
    !ansvarligInnlogget ||
    (no - sisteAktivitet) > TIMEOUT_MINUTTER * 60 * 1000
  ) {

    const kode = prompt("Skriv inn kode for ansvarlige:");

    if (kode !== ANSVARLIG_KODE) {
      alert("Feil kode");
      return;
    }

    ansvarligInnlogget = true;
  }

  sisteAktivitet = Date.now();

  document.getElementById("mainMenu").innerHTML = `
    <button class="menu-button" onclick="showResponsiblePage('deltakere')">Deltakere</button>
    <button class="menu-button" onclick="showResponsiblePage('instruktorer')">Instruktører</button>
    <button class="menu-button" onclick="showResponsiblePage('program')">Program</button>
    <button class="menu-button" onclick="showResponsiblePage('gjoremal')">Gjøremål</button>
	<button class="menu-button" onclick="showResponsiblePage('oppmote')">Oppmøte</button>
	<button class="menu-button" onclick="showResponsiblePage('mangler')">Manglar</button>
  `;

document.getElementById("content").innerHTML = `
  <div class="welcome-box">
    <h2>Ansvarlige</h2>
    <p>
      Her finn du oversikt over deltakarar, instruktørar,
      program og praktiske oppgåver under fotballskulen.
    </p>
  </div>
`;
}

function showResponsiblePage(page) {
  if (page === "deltakere") {
    showParticipants();
    return;
  }
  
  if (page === "oppmote") {
  document.getElementById("mainMenu").innerHTML = `
    <button class="menu-button" onclick="showAttendanceOverview(1)">Gruppe 1</button>
    <button class="menu-button" onclick="showAttendanceOverview(2)">Gruppe 2</button>
    <button class="menu-button" onclick="showAttendanceOverview(3)">Gruppe 3</button>
    <button class="menu-button" onclick="showAttendanceOverview(4)">Gruppe 4</button>
    <button class="menu-button" onclick="showAttendanceOverview(5)">Gruppe 5</button>
  `;

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Oppmøte</h2>
      <p>Velg gruppe for å sjå status på krysselistene.</p>
    </div>
  `;

  return;
}

if (page === "mangler") {
  document.getElementById("mainMenu").innerHTML = `
    <button class="menu-button" onclick="showMissingOverview('man_for')">Måndag<br>før lunsj</button>
    <button class="menu-button" onclick="showMissingOverview('man_etter')">Måndag<br>etter lunsj</button>
    <button class="menu-button" onclick="showMissingOverview('tir_for')">Tysdag<br>før lunsj</button>
    <button class="menu-button" onclick="showMissingOverview('tir_etter')">Tysdag<br>etter lunsj</button>
    <button class="menu-button" onclick="showMissingOverview('ons_for')">Onsdag<br>før lunsj</button>
    <button class="menu-button" onclick="showMissingOverview('ons_etter')">Onsdag<br>etter lunsj</button>
  `;

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Manglar oppmøte</h2>
      <p>Vel tidspunkt for å sjå alle som ikkje er kryssa av.</p>
    </div>
  `;

  return;
}

if (page === "instruktorer") {

  let cards = "";

  instructors
  .sort((a, b) => String(a.gruppe).localeCompare(String(b.gruppe)))
  .forEach(i => {
    cards += `
      <div class="contact-card">
        <h3>${i.navn}</h3>
<p><strong>Gruppe ${i.gruppe}</strong></p>
${i.telefon ? `<p>📱 ${i.telefon}</p>` : ""}
${i.epost ? `<p>✉️ ${i.epost}</p>` : ""}
      </div>
    `;
  });

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Instruktører (${instructors.length})</h2>

      <div class="contact-grid">
        ${cards}
      </div>
    </div>
  `;

  return;
}

if (page === "program") {
  document.getElementById("content").innerHTML = `
<div class="welcome-box">

<h2>⚽ TINE Fotballskule 2026</h2>

<h3>📅 Måndag 22. juni</h3>

<p>
<strong>09.00</strong> Oppmøte ansvarlege<br>
<strong>09.30</strong> Registrering opnar<br>
<strong>10.00</strong> Oppstart aktivitetar<br>
<strong>11.30</strong> Lunsj<br>
<strong>12.15</strong> Nye instruktørgrupper startar<br>
<strong>14.00</strong> Avslutning
</p>

<p>
<strong>Ansvarlege må passe på:</strong><br>
✔️ Registrering og oppmøte<br>
✔️ Utdeling av ball, sekk og t-skjorte<br>
✔️ Matservering<br>
✔️ Allergiar og spesielle behov<br>
✔️ Oppmøte etter lunsj<br>
✔️ Rydding etter endt dag
</p>

<hr>

<h3>📅 Tysdag 23. juni</h3>

<p>
<strong>09.00</strong> Oppmøte ansvarlege<br>
<strong>09.45</strong> Alle deltakarar skal vere på plass<br>
<strong>10.00</strong> Oppstart aktivitetar<br>
<strong>11.30</strong> Lunsj<br>
<strong>12.15</strong> Nye instruktørgrupper startar<br>
<strong>14.00</strong> Avslutning
</p>

<p>
<strong>Ansvarlege må passe på:</strong><br>
✔️ Oppmøte og registrering<br>
✔️ Matservering<br>
✔️ Allergiar og spesielle behov<br>
✔️ Oppmøte etter lunsj<br>
✔️ Førstehjelp ved behov<br>
✔️ Rydding etter endt dag
</p>

<hr>

<h3>📅 Onsdag 24. juni</h3>

<p>
<strong>09.00</strong> Oppmøte ansvarlege<br>
<strong>09.45</strong> Alle deltakarar skal vere på plass<br>
<strong>10.00</strong> Oppstart aktivitetar<br>
<strong>11.30</strong> Lunsj<br>
<strong>12.15</strong> Nye instruktørgrupper startar<br>
<strong>13.00</strong> Besøk frå Sparebanken Norge<br>
<strong>13.30</strong> Storkamp deltakarar mot instruktørar<br>
<strong>14.00</strong> Avslutning
</p>

<p>
<strong>Ansvarlege må passe på:</strong><br>
✔️ Oppmøte og registrering<br>
✔️ Matservering<br>
✔️ Allergiar og spesielle behov<br>
✔️ Besøkande og fotografering<br>
✔️ Storkampen<br>
✔️ Opprydding av anlegget
</p>

<h3>⭐ Hugs</h3>

<p>
Målet er at alle deltakarane skal ha det trygt, kjekt og oppleve meistring.
Ved spørsmål eller utfordringar skal ansvarlege vere synlege og tilgjengelege gjennom heile dagen.
</p>

</div>
`;
  return;
}

if (page === "gjoremal") {
  document.getElementById("content").innerHTML = `
    <div class="welcome-box">

      <h2>Gjøremål for ansvarlige</h2>

      <div class="important-box">
        <h3>⭐ Viktigast av alt</h3>

        <ul class="task-list">
          <li>Pass på at alle barna har det bra.</li>
          <li>Ha kontroll på allergiar og matservering.</li>
          <li>Sørg for at alle kjem seg trygt heim.</li>
        </ul>
      </div>

      <h3>✅ Før oppstart</h3>

      <ul class="task-list">
        <li>Ta imot deltakarar og føresette.</li>
        <li>Sjekk at alle finn rett gruppe.</li>
        <li>Sjå over bane, utstyr og serveringsområde.</li>
        <li>Ver tilgjengeleg for spørsmål frå føresette og instruktørar.</li>
      </ul>

      <h3>👀 Under aktivitetane</h3>

      <ul class="task-list">
        <li>Pass på at alle deltakarane har det bra.</li>
        <li>Følg opp barn som verkar lei seg eller står utanfor.</li>
        <li>Hjelp instruktørane dersom nokon treng ekstra støtte.</li>
        <li>Pass på at alle får drikke og pausar ved behov.</li>
      </ul>

      <h3>🍽️ Matservering</h3>

      <ul class="task-list">
        <li>Gjer klar lunsj i god tid.</li>
        <li>Kutt opp frukt og gjer klar utdeling.</li>
        <li>Server mat og drikke til gruppene.</li>
        <li>Sjekk allergiar før mat og drikke blir delt ut.</li>
        <li>Pass på at alle får mat.</li>
      </ul>

      <h3>🧹 Orden og rydding</h3>

      <ul class="task-list">
        <li>Hald orden rundt klubbhus og bane.</li>
        <li>Samle inn boss gjennom dagen.</li>
        <li>Rydd kjøkken og serveringsområde etter lunsj.</li>
        <li>Hjelp til med å samle inn ballar, kjegler og vestar.</li>
        <li>Sørg for at området er ryddig når dagen er over.</li>
      </ul>

      <h3>🚑 Tryggleik</h3>

      <ul class="task-list">
        <li>Ha oversikt over barn med allergiar eller spesielle behov.</li>
        <li>Ved skade: kontakt hovudansvarleg og føresette ved behov.</li>
        <li>Ved alvorleg skade eller sjukdom: ring 113.</li>
        <li>Pass på at ingen barn går frå området utan avtale.</li>
        <li>Sjekk at alle deltakarar blir henta eller kjem seg trygt heim.</li>
      </ul>

    </div>
  `;
  return;
}
} 

function showParticipants() {
  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Deltakere</h2>
      <p>Totalt: ${participants.length} deltakere</p>

      <div class="filter-row">
        <input id="searchInput" type="text" placeholder="Søk etter navn..." oninput="renderParticipants()">

        <select id="groupFilter" onchange="renderParticipants()">
          <option value="alle">Alle grupper</option>
          <option value="1">Gruppe 1</option>
          <option value="2">Gruppe 2</option>
          <option value="3">Gruppe 3</option>
          <option value="4">Gruppe 4</option>
          <option value="5">Gruppe 5</option>
        </select>
      </div>

      <div id="participantTable"></div>
    </div>
  `;

  renderParticipants();
}

function renderParticipants() {
  const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const group = document.getElementById("groupFilter")?.value || "alle";

  const filtered = participants.filter(p => {
    const matchesSearch = p.navn.toLowerCase().includes(search);
    const matchesGroup = group === "alle" || String(p.gruppe) === group;
    return matchesSearch && matchesGroup;
  });

  let html = `
    <table class="participant-table">
      <thead>
        <tr>
          <th>Navn</th>
          <th>Gruppe</th>
          <th>Født</th>
          <th>T-skjorte</th>
          <th>Allergi/mat</th>
        </tr>
      </thead>
      <tbody>
  `;

  filtered.forEach(p => {
    const allergyClass = p.allergi ? "allergy-cell" : "";
    html += `
      <tr>
        <td>${p.navn}</td>
        <td>${p.gruppe}</td>
        <td>${p.fodselsar}</td>
        <td>${p.tshirt}</td>
        <td class="${allergyClass}">${p.allergi || "-"}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  document.getElementById("participantTable").innerHTML = html;
}

function goHome() {
  document.getElementById("mainMenu").innerHTML = `
    <button class="menu-button" onclick="showInstructorInfo()">Instruktører</button>
    <button class="menu-button" onclick="showResponsibleMenu()">Ansvarlige</button>
  `;

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h1>Velkommen til TINE Fotballskule 2026</h1>
      <h2>Samnanger IL</h2>
      <p>Her finn du informasjon for instruktørar og ansvarlege under fotballskulen.</p>
    </div>
  `;
}

function showAttendanceOverview(group) {
  const groupParticipants = participants.filter(p => p.gruppe === group);

  const sessions = [
    { key: "man_for", label: "Måndag før lunsj" },
    { key: "man_etter", label: "Måndag etter lunsj" },
    { key: "tir_for", label: "Tysdag før lunsj" },
    { key: "tir_etter", label: "Tysdag etter lunsj" },
    { key: "ons_for", label: "Onsdag før lunsj" },
    { key: "ons_etter", label: "Onsdag etter lunsj" }
  ];

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Oppmøte - Gruppe ${group}</h2>
      <p>Oppdateres automatisk.</p>
      <div id="attendanceOverviewContent"></div>
    </div>
  `;

  if (overviewListener) {
    overviewListener();
  }

  overviewListener = db.collection("fotballskule2026")
    .doc("krysselister")
    .collection("gruppe" + group)
    .onSnapshot(snapshot => {
      const attendanceData = {};

      snapshot.forEach(doc => {
        attendanceData[doc.id] = doc.data();
      });

      let html = `<p><strong>Totalt i gruppa: ${groupParticipants.length}</strong></p>`;

      sessions.forEach(session => {
        const present = [];
        const missing = [];

        groupParticipants.forEach(p => {
          const id = makeId(p.navn);
console.log(id, attendanceData[id]);
          if (attendanceData[id] && attendanceData[id][session.key] === true) {
            present.push(p.navn);
          } else {
            missing.push(p.navn);
          }
        });

        html += `
          <div class="attendance-overview-section">
            <h3>${session.label}</h3>
            <p><strong>${present.length} / ${groupParticipants.length} møtt</strong></p>

            <h4>✅ Møtt</h4>
<ul class="attendance-name-list">
  ${present.map(name => {
  const id = makeId(name);
  return `<li onclick="saveAttendance('${id}', ${group}, '${session.key}', false)" class="clickable-name">${name}</li>`;
}).join("") || "<li>Ingen er kryssa av</li>"}
</ul>

<h4>❌ Manglar / ikkje kryssa av</h4>
<ul class="attendance-name-list missing">
  ${missing.map(name => {
  const id = makeId(name);
  return `<li onclick="saveAttendance('${id}', ${group}, '${session.key}', true)" class="clickable-name">${name}</li>`;
}).join("") || "<li>Alle er kryssa av</li>"}
</ul>
          </div>
        `;
      });

      document.getElementById("attendanceOverviewContent").innerHTML = html;
    });
}

async function sendFeedback() {
  const feedback = {
    trivsel: document.getElementById("trivsel").value,
    app: document.getElementById("app").value,
    ovelser: document.getElementById("ovelserFeedback").value,
    stotte: document.getElementById("stotte").value,
    bra: document.getElementById("bra").value,
    bedre: document.getElementById("bedre").value,
    forslag: document.getElementById("forslag").value,
    igjen: document.getElementById("igjen").value,
    tidspunkt: firebase.firestore.FieldValue.serverTimestamp()
  };

  await db.collection("fotballskule2026")
    .doc("tilbakemeldingar")
    .collection("instruktorar")
    .add(feedback);

  document.getElementById("feedbackStatus").innerHTML =
    "✅ Takk for tilbakemeldinga!";

  document.querySelectorAll("select, textarea").forEach(el => {
    el.value = "";
  });
}

let missingListener = null;

function showMissingOverview(session) {
  const labels = {
    man_for: "Måndag før lunsj",
    man_etter: "Måndag etter lunsj",
    tir_for: "Tysdag før lunsj",
    tir_etter: "Tysdag etter lunsj",
    ons_for: "Onsdag før lunsj",
    ons_etter: "Onsdag etter lunsj"
  };

  document.getElementById("content").innerHTML = `
    <div class="welcome-box">
      <h2>Manglar - ${labels[session]}</h2>
      <p>Oppdateres automatisk.</p>
      <div id="missingOverviewContent"></div>
    </div>
  `;

  if (missingListener) {
    missingListener();
  }

  const allData = {};

  let loadedGroups = 0;

  for (let group = 1; group <= 5; group++) {
    db.collection("fotballskule2026")
      .doc("krysselister")
      .collection("gruppe" + group)
      .onSnapshot(snapshot => {
        allData[group] = {};

        snapshot.forEach(doc => {
          allData[group][doc.id] = doc.data();
        });

        loadedGroups++;
        renderMissingOverview(session, labels[session], allData);
      });
  }
}

function renderMissingOverview(session, label, allData) {
  let totalMissing = 0;
  let html = "";

  for (let group = 1; group <= 5; group++) {
    const groupParticipants = participants.filter(p => p.gruppe === group);
    const missing = [];

    groupParticipants.forEach(p => {
      const id = makeId(p.navn);
      const data = allData[group]?.[id];

      if (!data || data[session] !== true) {
        missing.push(p);
      }
    });

    totalMissing += missing.length;

    html += `
      <div class="attendance-overview-section">
        <h3>Gruppe ${group}</h3>
        <p><strong>${groupParticipants.length - missing.length} / ${groupParticipants.length} møtt</strong></p>
    `;

    if (missing.length === 0) {
      html += `<p>✅ Alle er kryssa av.</p>`;
    } else {
      html += `<ul class="attendance-name-list missing">`;

      missing.forEach(p => {
        html += `
          <li class="missing-person">
            <strong>${p.navn}</strong>
            ${p.foresatt
  ? `<br>📞 ${p.foresatt}`
  : `<br><span class="no-phone">Ingen telefon lagt inn</span>`
}
          </li>
        `;
      });

      html += `</ul>`;
    }

    html += `</div>`;
  }

  document.getElementById("missingOverviewContent").innerHTML = `
    <div class="important-box">
      <h3>${label}</h3>
      <p><strong>Totalt manglar: ${totalMissing}</strong></p>
    </div>

    ${html}
  `;
}