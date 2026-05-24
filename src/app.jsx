import { useState, useRef, useEffect } from "react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'Plus Jakarta Sans',sans-serif;background:#f5f1ea}
:root{--g:#0f3d24;--gl:#1a6b3e;--gp:#e5f2ea;--gp2:#c8e6d4;--mp:#c41e2a;--mpp:#fdeced;--cream:#f5f1ea;--white:#fff;--t1:#111827;--t2:#4b5563;--t3:#9ca3af;--brd:#e5e0d5;--gold:#b45309;--goldp:#fef3c7;--r:14px;}
.si{animation:sli .28s ease both}
@keyframes sli{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.fi{animation:fdi .4s ease both}
@keyframes fdi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
button:focus{outline:2px solid var(--gl);outline-offset:2px}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}
`;

// ── ANIMATED GREETINGS ────────────────────────────────────────────────────────
const GREETINGS = [
  {w:'Hola',l:'Español'},{w:'Hello',l:'English'},{w:'Bonjour',l:'Français'},
  {w:'Olá',l:'Português'},{w:'Ciao',l:'Italiano'},{w:'Merhaba',l:'Türkçe'},
  {w:'你好',l:'中文'},{w:'नमस्ते',l:'हिन्दी'},{w:'مرحبا',l:'العربية'},
  {w:'Привет',l:'Русский'},{w:'안녕하세요',l:'한국어'},{w:'Hallo',l:'Deutsch'},
  {w:'こんにちは',l:'日本語'},{w:'Γεια σου',l:'Ελληνικά'},{w:'Mabuhay',l:'Filipino'},
  {w:'Sawubona',l:'Zulu'},{w:'Ahoj',l:'Čeština'},{w:'Salam',l:'فارسی'},
];

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const TR = {
  es:{
    chooseLang:'Elige tu idioma para continuar',
    langSubtitle:'Asesor de Inmigración a Canadá · Gratis',
    title:'¿Puedo emigrar a Canadá?',
    sub:'Miles de personas pagan miles de dólares a consultores por información que es pública y gratuita. En 5 minutos te decimos si eres candidato y cuál es tu mejor camino — sin costo alguno.',
    c1t:'Evaluación Real',c1d:'Usamos los criterios oficiales del gobierno canadiense: CRS, Express Entry, PNP y más.',
    c2t:'Sin Letra Pequeña',c2d:'Te decimos exactamente qué programas aplican y qué puedes mejorar.',
    c3t:'100% Gratis',c3d:'Esta información es pública. No necesitas pagarle a nadie para conocer tus opciones.',
    startBtn:'Comenzar Evaluación Gratis →',
    disc:'Herramienta orientativa, no asesoría legal. Verifica siempre en canada.ca.',
    qof:(n,t)=>`Pregunta ${n} de ${t}`,back:'← Pregunta anterior',
    evalTitle:'Tu Evaluación de Candidatura',pts:'pts CRS',
    crsNote:'Draws recientes (2025): ~470–510 todos los programas · Categóricos: ~430–480',
    bdTitle:'Desglose de puntos',progTitle:'Tus opciones de inmigración',
    eligible:'✓ Potencialmente elegible',possible:'◈ Posible con pasos adicionales',infoSt:'💡 Recomendación',
    strong:'Candidato Fuerte',moderate:'Candidato Moderado',strategy:'Posible con Estrategia',needs:'Necesitas Mejorar tu Perfil',
    officialNote:'📌 Recuerda: Toda esta información es pública y gratuita. Puedes aplicar directamente en canada.ca — el sitio oficial del gobierno canadiense. No necesitas pagar a ningún consultor.',
    approxNote:'⚠️ Puntaje estimado. El oficial lo calcula IRCC cuando creas tu perfil en canada.ca.',
    chatTitle:'¿Tienes preguntas?',chatSub:'Respuestas basadas en tu perfil — gratis, sin compromisos',
    chatPlaceholder:'Escribe tu pregunta aquí...',sendBtn:'Enviar',freqQ:'Preguntas frecuentes',
    restart:'↺ Empezar de nuevo',writing:'Escribiendo...',errMsg:'❌ Error de conexión. Intenta de nuevo.',
    chatWelcome:'¡Hola! Analicé tu perfil. ¿Tienes alguna pregunta sobre tus opciones de inmigración o el proceso?',
    quickQs:['¿Necesito un consultor?','¿Cuánto cuesta aplicar?','¿Cuánto tiempo tarda?','¿Qué documentos necesito?','¿Puedo trabajar mientras espero?','¿Mi familia puede venir conmigo?'],
    bdAge:'Edad',bdEdu:'Educación',bdLang:'Idiomas',bdCan:'Exp. en Canadá',bdSkill:'Transferibilidad',bdAdd:'Puntos adicionales',
    tf:'⏱',tipLbl:'💡',
  },
  en:{
    chooseLang:'Choose your language to continue',
    langSubtitle:'Canada Immigration Advisor · Free',
    title:'Can I immigrate to Canada?',
    sub:'Thousands of people pay consultants thousands of dollars for public, free information. In 5 minutes, we tell you if you\'re a candidate and what\'s your best path — at no cost.',
    c1t:'Real Assessment',c1d:'We use official Canadian government criteria: CRS, Express Entry, PNP and more.',
    c2t:'No Fine Print',c2d:'We tell you exactly which programs apply and what you can improve.',
    c3t:'100% Free',c3d:'This information is public. You don\'t need to pay anyone to know your options.',
    startBtn:'Start Free Assessment →',
    disc:'Informational tool, not legal advice. Always verify at canada.ca.',
    qof:(n,t)=>`Question ${n} of ${t}`,back:'← Previous question',
    evalTitle:'Your Candidacy Assessment',pts:'CRS pts',
    crsNote:'Recent draws (2025): ~470–510 all programs · Category-based: ~430–480',
    bdTitle:'Points breakdown',progTitle:'Your immigration options',
    eligible:'✓ Potentially eligible',possible:'◈ Possible with extra steps',infoSt:'💡 Recommendation',
    strong:'Strong Candidate',moderate:'Moderate Candidate',strategy:'Possible with Strategy',needs:'Profile Needs Improvement',
    officialNote:'📌 Remember: All this information is public and free. You can apply directly at canada.ca — the official Canadian government website. You don\'t need to pay any consultant.',
    approxNote:'⚠️ Estimated score. The official score is calculated by IRCC when you create your profile at canada.ca.',
    chatTitle:'Have questions?',chatSub:'Answers based on your profile — free, no strings attached',
    chatPlaceholder:'Type your question here...',sendBtn:'Send',freqQ:'Frequently asked questions',
    restart:'↺ Start over',writing:'Typing...',errMsg:'❌ Connection error. Please try again.',
    chatWelcome:'Hello! I\'ve analyzed your profile. Do you have any questions about your immigration options or the process?',
    quickQs:['Do I need a consultant?','How much does applying cost?','How long does it take?','What documents do I need?','Can I work while waiting?','Can my family come with me?'],
    bdAge:'Age',bdEdu:'Education',bdLang:'Languages',bdCan:'Canadian exp.',bdSkill:'Transferability',bdAdd:'Additional points',
    tf:'⏱',tipLbl:'💡',
  },
  fr:{
    chooseLang:'Choisissez votre langue pour continuer',
    langSubtitle:'Conseiller en Immigration au Canada · Gratuit',
    title:'Puis-je immigrer au Canada?',
    sub:'Des milliers de personnes paient des consultants pour des informations publiques et gratuites. En 5 minutes, nous vous disons si vous êtes candidat et quelle est votre meilleure voie — sans frais.',
    c1t:'Évaluation Réelle',c1d:'Nous utilisons les critères officiels du gouvernement canadien: SCG, Entrée express, PNP.',
    c2t:'Sans Surprise',c2d:'Nous vous indiquons exactement quels programmes s\'appliquent et quoi améliorer.',
    c3t:'100% Gratuit',c3d:'Ces informations sont publiques. Pas besoin de payer qui que ce soit.',
    startBtn:'Commencer l\'évaluation gratuite →',
    disc:'Outil informatif, pas de conseil juridique. Vérifiez toujours sur canada.ca.',
    qof:(n,t)=>`Question ${n} sur ${t}`,back:'← Question précédente',
    evalTitle:'Votre Évaluation de Candidature',pts:'pts SCG',
    crsNote:'Tirages récents (2025): ~470–510 tous programmes · Catégoriels: ~430–480',
    bdTitle:'Répartition des points',progTitle:'Vos options d\'immigration',
    eligible:'✓ Potentiellement admissible',possible:'◈ Possible avec étapes supplémentaires',infoSt:'💡 Recommandation',
    strong:'Candidat Fort',moderate:'Candidat Modéré',strategy:'Possible avec Stratégie',needs:'Profil à Améliorer',
    officialNote:'📌 Rappel: Toutes ces informations sont publiques et gratuites. Vous pouvez postuler directement sur canada.ca — le site officiel du gouvernement canadien.',
    approxNote:'⚠️ Score estimé. Le score officiel est calculé par IRCC quand vous créez votre profil sur canada.ca.',
    chatTitle:'Des questions?',chatSub:'Réponses basées sur votre profil — gratuites, sans engagement',
    chatPlaceholder:'Écrivez votre question ici...',sendBtn:'Envoyer',freqQ:'Questions fréquentes',
    restart:'↺ Recommencer',writing:'En train d\'écrire...',errMsg:'❌ Erreur de connexion. Réessayez.',
    chatWelcome:'Bonjour! J\'ai analysé votre profil. Avez-vous des questions sur vos options d\'immigration ou le processus?',
    quickQs:['Ai-je besoin d\'un consultant?','Combien coûte la demande?','Combien de temps faut-il?','Quels documents sont nécessaires?','Puis-je travailler en attendant?','Ma famille peut-elle venir avec moi?'],
    bdAge:'Âge',bdEdu:'Éducation',bdLang:'Langues',bdCan:'Exp. au Canada',bdSkill:'Transférabilité',bdAdd:'Points additionnels',
    tf:'⏱',tipLbl:'💡',
  }
};

// ── QUESTIONS PER LANGUAGE ────────────────────────────────────────────────────
const QS_DATA = {
  es:[
    {id:'marital',q:'¿Cuál es tu estado civil?',sub:'Afecta cómo se calculan tus puntos CRS',opts:[{v:'single',l:'Soltero/a',e:'👤'},{v:'married',l:'Casado/a o en unión libre',e:'👫'},{v:'div',l:'Separado/a, divorciado/a o viudo/a',e:'👤'}]},
    {id:'spouse',q:'¿Tu pareja vendría contigo a Canadá?',sub:'Si te acompaña, sus calificaciones también suman puntos',cond:a=>a.marital==='married',opts:[{v:'yes',l:'Sí, vendría conmigo a Canadá',e:'✈️'},{v:'no',l:'No, se quedaría / ya tiene PR o ciudadanía canadiense',e:'🏠'}]},
    {id:'age',q:'¿Cuántos años tienes?',sub:'Los puntos son máximos entre 20 y 29 años',opts:[{v:'20',l:'18 a 22 años',e:'🌱'},{v:'26',l:'23 a 29 años',e:'⚡'},{v:'32',l:'30 a 35 años',e:'💪'},{v:'38',l:'36 a 40 años',e:'🎯'},{v:'43',l:'41 a 44 años',e:'📊'},{v:'50',l:'45 años o más',e:'⚠️'}]},
    {id:'edu',q:'¿Cuál es tu nivel de educación más alto completado?',sub:'Si estudiaste fuera de Canadá se requiere evaluación de credenciales (ECA)',opts:[{v:'none',l:'Sin estudios o primaria',e:'📝'},{v:'hs',l:'Secundaria o bachillerato',e:'🏫'},{v:'c1',l:'Técnico o carrera de 1 año',e:'📜'},{v:'c2',l:'Técnico o carrera de 2 años',e:'📋'},{v:'bach',l:'Licenciatura / Ingeniería (3-4+ años)',e:'🎓'},{v:'two',l:'Dos o más títulos (uno de 3+ años)',e:'🏆'},{v:'mast',l:'Maestría o doctorado profesional (medicina, derecho...)',e:'⭐'},{v:'phd',l:'Doctorado (PhD)',e:'🔬'}]},
    {id:'english',q:'¿Cómo es tu nivel de inglés?',sub:'El inglés es el factor con MÁS impacto en tu puntaje — sé honesto/a',opts:[{v:'none',l:'No hablo inglés',e:'❌'},{v:'basic',l:'Básico — me presento, entiendo poco',e:'🔤'},{v:'inter',l:'Intermedio — me defiendo en el día a día (B1)',e:'💬'},{v:'good',l:'Bueno — trabajo o estudio en inglés cómodamente (B2 / CLB 8)',e:'✅'},{v:'adv',l:'Avanzado — casi nativo, muy fluido (C1 / CLB 9)',e:'🌟'},{v:'fluent',l:'Nativo o completamente fluido (CLB 10+)',e:'🏅'}]},
    {id:'french',q:'¿Hablas francés?',sub:'Te da hasta 50 puntos extra en CRS y abre Quebec y Canadá francófona',opts:[{v:'none',l:'No, nada de francés',e:'❌'},{v:'basic',l:'Muy básico — algunas palabras',e:'🔤'},{v:'inter',l:'Intermedio — puedo conversar (CLB 7)',e:'💬'},{v:'good',l:'Bueno — me desenvuelvo bien (CLB 8+)',e:'✅'},{v:'fluent',l:'Fluido o nativo en francés',e:'🏅'}]},
    {id:'occ',q:'¿En qué tipo de trabajo has trabajado?',sub:'Canadá clasifica ocupaciones por nivel de habilidad (TEER 0–5)',opts:[{v:'mgr',l:'Gerente / Directivo / Ejecutivo (TEER 0)',e:'👔'},{v:'pro',l:'Profesional: ingeniero, médico, contador, maestro, abogado... (TEER 1)',e:'💼'},{v:'tech',l:'Técnico: enfermero, programador, técnico industrial... (TEER 2)',e:'⚙️'},{v:'trades',l:'Oficio calificado: electricista, cocinero, mecánico, soldador... (TEER 3)',e:'🔧'},{v:'semi',l:'Semi-calificado: chofer, operador, vendedor, mesero... (TEER 4)',e:'🚗'},{v:'unsk',l:'Sin calificación: limpieza, obrero, seguridad... (TEER 5)',e:'👷'},{v:'stud',l:'Estudiante / Sin experiencia laboral',e:'📚'}]},
    {id:'workYears',q:'¿Cuántos años de experiencia laboral tienes en total?',sub:'En tu campo principal, en los últimos 10 años',opts:[{v:'0',l:'Sin experiencia o menos de 1 año',e:'0️⃣'},{v:'1',l:'1 año',e:'1️⃣'},{v:'2',l:'2 años',e:'2️⃣'},{v:'3',l:'3 años',e:'3️⃣'},{v:'4',l:'4 años',e:'4️⃣'},{v:'5',l:'5 o más años',e:'🏆'}]},
    {id:'canWork',q:'¿Has vivido o trabajado en Canadá?',sub:'La experiencia laboral canadiense tiene enorme peso en Express Entry',opts:[{v:'0',l:'No, nunca he vivido ni trabajado en Canadá',e:'🌍'},{v:'0',l:'Visité como turista, pero no trabajé',e:'✈️'},{v:'1',l:'Sí, aproximadamente 1 año de trabajo en Canadá',e:'🍁'},{v:'2',l:'Sí, 2 años de trabajo en Canadá',e:'🍁🍁'},{v:'3',l:'Sí, 3 o más años de trabajo en Canadá',e:'🍁🍁🍁'}]},
    {id:'sibling',q:'¿Tienes algún hermano/a ciudadano canadiense o residente permanente?',sub:'Un hermano/a en Canadá te da 15 puntos extra en CRS',opts:[{v:'no',l:'No tengo hermanos en Canadá',e:'❌'},{v:'yes',l:'Sí, tengo un hermano/a con ciudadanía o PR canadiense',e:'✅'}]},
    {id:'prov',q:'¿A qué provincia preferirías mudarte?',sub:'Cada provincia tiene programas propios (PNP) con diferentes requisitos',opts:[{v:'any',l:'No tengo preferencia / cualquier provincia',e:'🗺️'},{v:'on',l:'Ontario (Toronto, Ottawa, Hamilton)',e:'🏙️'},{v:'bc',l:'Columbia Británica (Vancouver, Victoria)',e:'🌊'},{v:'ab',l:'Alberta (Calgary, Edmonton)',e:'⛰️'},{v:'qc',l:'Quebec (Montreal, Quebec City)',e:'⚜️'},{v:'mb',l:'Manitoba (Winnipeg)',e:'🌾'},{v:'sk',l:'Saskatchewan (Regina, Saskatoon)',e:'🌾'},{v:'at',l:'Provincias del Atlántico (NB, NS, PEI, NL)',e:'🌊'}]},
  ],
  en:[
    {id:'marital',q:'What is your marital status?',sub:'This affects how your CRS points are calculated',opts:[{v:'single',l:'Single',e:'👤'},{v:'married',l:'Married or in a common-law relationship',e:'👫'},{v:'div',l:'Separated, divorced, or widowed',e:'👤'}]},
    {id:'spouse',q:'Would your partner come with you to Canada?',sub:'If they accompany you, their qualifications also add points',cond:a=>a.marital==='married',opts:[{v:'yes',l:'Yes, they would come with me to Canada',e:'✈️'},{v:'no',l:'No, they would stay / already have Canadian PR or citizenship',e:'🏠'}]},
    {id:'age',q:'How old are you?',sub:'Points are highest between 20 and 29 years old',opts:[{v:'20',l:'18 to 22 years',e:'🌱'},{v:'26',l:'23 to 29 years',e:'⚡'},{v:'32',l:'30 to 35 years',e:'💪'},{v:'38',l:'36 to 40 years',e:'🎯'},{v:'43',l:'41 to 44 years',e:'📊'},{v:'50',l:'45 years or older',e:'⚠️'}]},
    {id:'edu',q:'What is your highest completed education level?',sub:'If you studied outside Canada, a credential evaluation (ECA) is required',opts:[{v:'none',l:'No formal education or elementary school',e:'📝'},{v:'hs',l:'High school diploma',e:'🏫'},{v:'c1',l:'1-year technical or college diploma',e:'📜'},{v:'c2',l:'2-year technical or college diploma',e:'📋'},{v:'bach',l:'Bachelor\'s degree / Engineering (3-4+ years)',e:'🎓'},{v:'two',l:'Two or more degrees (one of 3+ years)',e:'🏆'},{v:'mast',l:'Master\'s or professional degree (medicine, law...)',e:'⭐'},{v:'phd',l:'Doctoral degree (PhD)',e:'🔬'}]},
    {id:'english',q:'How would you rate your English level?',sub:'English has the BIGGEST impact on your CRS score — be honest',opts:[{v:'none',l:'I don\'t speak English',e:'❌'},{v:'basic',l:'Basic — I can introduce myself, understand little',e:'🔤'},{v:'inter',l:'Intermediate — I get by in everyday situations (B1)',e:'💬'},{v:'good',l:'Good — I work/study in English comfortably (B2 / CLB 8)',e:'✅'},{v:'adv',l:'Advanced — near-native, very fluent (C1 / CLB 9)',e:'🌟'},{v:'fluent',l:'Native or fully fluent (CLB 10+)',e:'🏅'}]},
    {id:'french',q:'Do you speak French?',sub:'French can give you up to 50 extra CRS points and opens Quebec',opts:[{v:'none',l:'No French at all',e:'❌'},{v:'basic',l:'Very basic — a few words or phrases',e:'🔤'},{v:'inter',l:'Intermediate — I can hold a conversation (CLB 7)',e:'💬'},{v:'good',l:'Good — I handle myself well (CLB 8+)',e:'✅'},{v:'fluent',l:'Fluent or native in French',e:'🏅'}]},
    {id:'occ',q:'What type of work have you primarily done?',sub:'Canada classifies occupations by skill level (TEER 0–5)',opts:[{v:'mgr',l:'Manager / Director / Executive (TEER 0)',e:'👔'},{v:'pro',l:'Professional: engineer, doctor, accountant, teacher, lawyer... (TEER 1)',e:'💼'},{v:'tech',l:'Technical: nurse, programmer, industrial technician... (TEER 2)',e:'⚙️'},{v:'trades',l:'Skilled trade: electrician, cook, mechanic, welder... (TEER 3)',e:'🔧'},{v:'semi',l:'Semi-skilled: driver, machine operator, salesperson, waiter... (TEER 4)',e:'🚗'},{v:'unsk',l:'Unskilled: cleaning, laborer, security guard... (TEER 5)',e:'👷'},{v:'stud',l:'Student / No work experience',e:'📚'}]},
    {id:'workYears',q:'How many years of work experience do you have in total?',sub:'In your main field, within the last 10 years',opts:[{v:'0',l:'No experience or less than 1 year',e:'0️⃣'},{v:'1',l:'1 year',e:'1️⃣'},{v:'2',l:'2 years',e:'2️⃣'},{v:'3',l:'3 years',e:'3️⃣'},{v:'4',l:'4 years',e:'4️⃣'},{v:'5',l:'5 or more years',e:'🏆'}]},
    {id:'canWork',q:'Have you ever lived or worked in Canada?',sub:'Canadian work experience carries enormous weight in Express Entry',opts:[{v:'0',l:'No, I have never lived or worked in Canada',e:'🌍'},{v:'0',l:'I visited as a tourist but did not work',e:'✈️'},{v:'1',l:'Yes, approximately 1 year of work in Canada',e:'🍁'},{v:'2',l:'Yes, 2 years of work in Canada',e:'🍁🍁'},{v:'3',l:'Yes, 3 or more years of work in Canada',e:'🍁🍁🍁'}]},
    {id:'sibling',q:'Do you have a sibling who is a Canadian citizen or permanent resident?',sub:'A sibling in Canada gives you 15 extra CRS points',opts:[{v:'no',l:'No, I have no siblings in Canada',e:'❌'},{v:'yes',l:'Yes, I have a sibling who is a Canadian citizen or permanent resident',e:'✅'}]},
    {id:'prov',q:'Which province would you prefer to move to?',sub:'Each province has its own programs (PNP) with different requirements',opts:[{v:'any',l:'No preference / any province',e:'🗺️'},{v:'on',l:'Ontario (Toronto, Ottawa, Hamilton)',e:'🏙️'},{v:'bc',l:'British Columbia (Vancouver, Victoria)',e:'🌊'},{v:'ab',l:'Alberta (Calgary, Edmonton)',e:'⛰️'},{v:'qc',l:'Quebec (Montreal, Quebec City)',e:'⚜️'},{v:'mb',l:'Manitoba (Winnipeg)',e:'🌾'},{v:'sk',l:'Saskatchewan (Regina, Saskatoon)',e:'🌾'},{v:'at',l:'Atlantic Provinces (NB, NS, PEI, NL)',e:'🌊'}]},
  ],
  fr:[
    {id:'marital',q:'Quel est votre état civil?',sub:'Cela affecte le calcul de vos points SCG',opts:[{v:'single',l:'Célibataire',e:'👤'},{v:'married',l:'Marié(e) ou en union de fait',e:'👫'},{v:'div',l:'Séparé(e), divorcé(e) ou veuf/veuve',e:'👤'}]},
    {id:'spouse',q:'Votre partenaire viendrait-il/elle avec vous au Canada?',sub:'S\'il/elle vous accompagne, ses qualifications ajoutent aussi des points',cond:a=>a.marital==='married',opts:[{v:'yes',l:'Oui, il/elle viendrait avec moi au Canada',e:'✈️'},{v:'no',l:'Non, il/elle resterait / a déjà la RP ou citoyenneté canadienne',e:'🏠'}]},
    {id:'age',q:'Quel âge avez-vous?',sub:'Les points sont maximaux entre 20 et 29 ans',opts:[{v:'20',l:'18 à 22 ans',e:'🌱'},{v:'26',l:'23 à 29 ans',e:'⚡'},{v:'32',l:'30 à 35 ans',e:'💪'},{v:'38',l:'36 à 40 ans',e:'🎯'},{v:'43',l:'41 à 44 ans',e:'📊'},{v:'50',l:'45 ans ou plus',e:'⚠️'}]},
    {id:'edu',q:'Quel est votre niveau d\'éducation le plus élevé complété?',sub:'Si vous avez étudié hors du Canada, une évaluation des diplômes (ECA) est requise',opts:[{v:'none',l:'Sans scolarité ou école primaire',e:'📝'},{v:'hs',l:'Diplôme d\'études secondaires',e:'🏫'},{v:'c1',l:'Diplôme technique ou collégial de 1 an',e:'📜'},{v:'c2',l:'Diplôme technique ou collégial de 2 ans',e:'📋'},{v:'bach',l:'Baccalauréat / Ingénierie (3-4+ ans)',e:'🎓'},{v:'two',l:'Deux diplômes ou plus (dont un de 3+ ans)',e:'🏆'},{v:'mast',l:'Maîtrise ou diplôme professionnel (médecine, droit...)',e:'⭐'},{v:'phd',l:'Doctorat (PhD)',e:'🔬'}]},
    {id:'english',q:'Quel est votre niveau d\'anglais?',sub:'L\'anglais a le PLUS GRAND impact sur votre score SCG — soyez honnête',opts:[{v:'none',l:'Je ne parle pas anglais',e:'❌'},{v:'basic',l:'Débutant — je peux me présenter, je comprends peu',e:'🔤'},{v:'inter',l:'Intermédiaire — je me débrouille au quotidien (B1)',e:'💬'},{v:'good',l:'Bon — je travaille/étudie en anglais confortablement (B2 / CLB 8)',e:'✅'},{v:'adv',l:'Avancé — quasi natif, très courant (C1 / CLB 9)',e:'🌟'},{v:'fluent',l:'Natif ou totalement courant (CLB 10+)',e:'🏅'}]},
    {id:'french',q:'Parlez-vous français?',sub:'Le français peut vous donner jusqu\'à 50 points SCG supplémentaires et ouvre le Québec',opts:[{v:'none',l:'Non, pas du tout',e:'❌'},{v:'basic',l:'Très basique — quelques mots ou phrases',e:'🔤'},{v:'inter',l:'Intermédiaire — je peux avoir une conversation (CLB 7)',e:'💬'},{v:'good',l:'Bon — je me débrouille bien (CLB 8+)',e:'✅'},{v:'fluent',l:'Courant ou natif en français',e:'🏅'}]},
    {id:'occ',q:'Dans quel type de travail avez-vous principalement travaillé?',sub:'Le Canada classe les professions par niveau de compétence (TEER 0–5)',opts:[{v:'mgr',l:'Gestionnaire / Directeur / Cadre supérieur (TEER 0)',e:'👔'},{v:'pro',l:'Professionnel: ingénieur, médecin, comptable, enseignant... (TEER 1)',e:'💼'},{v:'tech',l:'Technicien: infirmier, programmeur, technicien industriel... (TEER 2)',e:'⚙️'},{v:'trades',l:'Métier qualifié: électricien, cuisinier, mécanicien... (TEER 3)',e:'🔧'},{v:'semi',l:'Semi-qualifié: chauffeur, opérateur, vendeur, serveur... (TEER 4)',e:'🚗'},{v:'unsk',l:'Sans qualification: nettoyage, ouvrier, gardien... (TEER 5)',e:'👷'},{v:'stud',l:'Étudiant / Sans expérience professionnelle',e:'📚'}]},
    {id:'workYears',q:'Combien d\'années d\'expérience professionnelle avez-vous au total?',sub:'Dans votre domaine principal, au cours des 10 dernières années',opts:[{v:'0',l:'Sans expérience ou moins d\'1 an',e:'0️⃣'},{v:'1',l:'1 an',e:'1️⃣'},{v:'2',l:'2 ans',e:'2️⃣'},{v:'3',l:'3 ans',e:'3️⃣'},{v:'4',l:'4 ans',e:'4️⃣'},{v:'5',l:'5 ans ou plus',e:'🏆'}]},
    {id:'canWork',q:'Avez-vous déjà vécu ou travaillé au Canada?',sub:'L\'expérience professionnelle canadienne a un énorme poids dans Entrée express',opts:[{v:'0',l:'Non, je n\'ai jamais vécu ni travaillé au Canada',e:'🌍'},{v:'0',l:'J\'ai visité en touriste, mais je n\'ai pas travaillé',e:'✈️'},{v:'1',l:'Oui, environ 1 an de travail au Canada',e:'🍁'},{v:'2',l:'Oui, 2 ans de travail au Canada',e:'🍁🍁'},{v:'3',l:'Oui, 3 ans ou plus de travail au Canada',e:'🍁🍁🍁'}]},
    {id:'sibling',q:'Avez-vous un frère ou une sœur citoyen(ne) canadien(ne) ou résident(e) permanent(e)?',sub:'Un frère/sœur au Canada vous donne 15 points SCG supplémentaires',opts:[{v:'no',l:'Non, je n\'ai pas de frère/sœur au Canada',e:'❌'},{v:'yes',l:'Oui, j\'ai un(e) frère/sœur citoyen(ne) ou RP canadien(ne)',e:'✅'}]},
    {id:'prov',q:'Dans quelle province préféreriez-vous vous installer?',sub:'Chaque province a ses propres programmes (PNP) avec des exigences différentes',opts:[{v:'any',l:'Pas de préférence / n\'importe quelle province',e:'🗺️'},{v:'on',l:'Ontario (Toronto, Ottawa, Hamilton)',e:'🏙️'},{v:'bc',l:'Colombie-Britannique (Vancouver, Victoria)',e:'🌊'},{v:'ab',l:'Alberta (Calgary, Edmonton)',e:'⛰️'},{v:'qc',l:'Québec (Montréal, Québec)',e:'⚜️'},{v:'mb',l:'Manitoba (Winnipeg)',e:'🌾'},{v:'sk',l:'Saskatchewan (Regina, Saskatoon)',e:'🌾'},{v:'at',l:'Provinces Atlantiques (NB, NÉ, ÎPÉ, NL)',e:'🌊'}]},
  ],
};

function getQS(lang){
  return (QS_DATA[lang]||QS_DATA.es).map(q=>({...q,cond:q.cond||null}));
}

// ── CRS TABLES ────────────────────────────────────────────────────────────────
const T_AGE={ns:{18:99,19:105,20:110,21:110,22:110,23:110,24:110,25:110,26:110,27:110,28:110,29:110,30:105,31:99,32:94,33:88,34:83,35:77,36:72,37:66,38:61,39:55,40:50,41:39,42:28,43:17,44:6},ws:{18:90,19:95,20:100,21:100,22:100,23:100,24:100,25:100,26:100,27:100,28:100,29:100,30:95,31:90,32:85,33:80,34:75,35:70,36:65,37:60,38:55,39:50,40:45,41:35,42:25,43:15,44:5}};
const T_EDU={ns:{none:0,hs:30,c1:90,c2:98,bach:120,two:128,mast:135,phd:150},ws:{none:0,hs:28,c1:84,c2:91,bach:112,two:119,mast:126,phd:140}};
const T_LANG={ns:{0:0,4:6,5:6,6:9,7:17,8:23,9:31,10:34},ws:{0:0,4:6,5:6,6:8,7:16,8:22,9:29,10:32}};
const T_CW={ns:{0:0,1:40,2:53,3:64,4:72,5:80},ws:{0:0,1:35,2:46,3:56,4:63,5:70}};
const LV2C={none:0,basic:5,inter:7,good:8,adv:9,fluent:10};
const agePts=(age,sp)=>{if(age<=17||age>=45)return 0;return(sp?T_AGE.ws:T_AGE.ns)[age]||0};
const eduPts=(edu,sp)=>(sp?T_EDU.ws:T_EDU.ns)[edu]||0;
const langPts=(lv,sp)=>{const c=LV2C[lv]||0;if(c<4)return 0;return((sp?T_LANG.ws:T_LANG.ns)[Math.min(c,10)]||0)*4};
const sec2Pts=(lv)=>{const c=LV2C[lv]||0;if(c<5)return 0;return({5:0,6:0,7:16,8:20,9:22,10:22})[Math.min(c,10)]||0};
const cwPts=(yrs,sp)=>{const y=Math.min(parseInt(yrs)||0,5);return(sp?T_CW.ws:T_CW.ns)[y]||0};
function skillT(a){
  const c=LV2C[a.english]||0,w=parseInt(a.workYears)||0;
  const sk=['mgr','pro','tech','trades'].includes(a.occ);if(!sk||w<1)return 0;
  let p=0;
  if(c>=9&&w>=3)p+=50;else if(c>=9)p+=25;else if(c>=7&&w>=3)p+=25;else if(c>=7)p+=13;
  if(['bach','two','mast','phd'].includes(a.edu)){if(c>=9)p+=Math.min(25,100-p);else if(c>=7)p+=Math.min(13,100-p);}
  return Math.min(p,100);
}
function calcCRS(a){
  const sp=a.marital==='married'&&a.spouse==='yes',age=parseInt(a.age)||0;
  const ag=agePts(age,sp),ed=eduPts(a.edu,sp),en=langPts(a.english,sp),fr=sec2Pts(a.french);
  const lang=Math.min(en+fr,sp?150:160),cw=cwPts(a.canWork,sp),sk=skillT(a);
  let add=0;if(a.sibling==='yes')add+=15;if((LV2C[a.french]||0)>=7)add+=25;
  return{total:Math.round(ag+ed+lang+cw+sk+add),bd:{ag,ed,lang,cw,sk,add},sp};
}
function checkFSWP(a){
  const age=parseInt(a.age)||0,w=parseInt(a.workYears)||0;
  const sk=['mgr','pro','tech','trades'].includes(a.occ),c=LV2C[a.english]||0;let p=0;
  if(age>=18&&age<=35)p+=12;else if(age>35)p+=Math.max(0,12-(age-35));
  p+=({none:0,hs:5,c1:15,c2:19,bach:21,two:22,mast:23,phd:25})[a.edu]||0;
  if(sk){if(w>=6)p+=15;else if(w>=4)p+=13;else if(w>=2)p+=11;else if(w>=1)p+=9;}
  if(c>=9)p+=24;else if(c>=8)p+=20;else if(c>=7)p+=16;else if(c>=6)p+=8;else if(c>=5)p+=4;
  if(parseInt(a.canWork)>=1)p+=5;if(a.sibling==='yes')p+=5;
  return{p,ok:p>=67,sk};
}

// ── PROGRAM TEXT (multilingual) ───────────────────────────────────────────────
function getPrograms(a,crs,fswp,lang){
  const T=(es,en,fr)=>lang==='en'?en:lang==='fr'?fr:es;
  const w=parseInt(a.workYears)||0,cw=parseInt(a.canWork)||0;
  const cen=LV2C[a.english]||0,cfr=LV2C[a.french]||0;
  const sk=fswp.sk,tr=a.occ==='trades',age=parseInt(a.age)||0,pv=a.prov,progs=[];

  if(cw>=1&&sk&&cen>=7)progs.push({id:'cec',ico:'🍁',
    name:T('Express Entry – Canadian Experience Class (CEC)','Express Entry – Canadian Experience Class (CEC)','Entrée express – Catégorie de l\'expérience canadienne (CEC)'),
    st:'eligible',
    desc:T(`Tienes ${cw} año(s) de experiencia laboral calificada en Canadá. Este es tu camino más directo y rápido a la Residencia Permanente.`,
      `You have ${cw} year(s) of skilled Canadian work experience. This is your most direct and fastest path to Permanent Residence.`,
      `Vous avez ${cw} an(s) d'expérience professionnelle qualifiée au Canada. C'est votre voie la plus directe vers la résidence permanente.`),
    tip:T('Los draws de CEC recientes han tenido puntajes ~520. Con un PNP obtienes +600 puntos automáticos.',
      'Recent CEC draws have had scores ~520. With a PNP you get +600 automatic points.',
      'Les tirages CEC récents ont eu des scores ~520. Avec un PNP vous obtenez +600 points automatiques.'),
    tf:T('6–12 meses','6–12 months','6–12 mois')});

  if(fswp.ok&&sk&&w>=1&&cen>=7){const v=crs.total>=470;
    progs.push({id:'fswp',ico:'💼',
      name:T('Express Entry – Federal Skilled Worker Program (FSWP)','Express Entry – Federal Skilled Worker Program (FSWP)','Entrée express – Programme des travailleurs qualifiés fédéraux (PTQF)'),
      st:v?'eligible':'possible',
      desc:T(`Calificas para el FSWP con ${fswp.p}/100 puntos en el sistema de selección.`,`You qualify for the FSWP with ${fswp.p}/100 points in the selection system.`,`Vous êtes admissible au PTQF avec ${fswp.p}/100 points dans le système de sélection.`),
      tip:v?T('Tu puntaje CRS es competitivo. Crear tu perfil Express Entry es el primer paso.','Your CRS score is competitive. Creating your Express Entry profile is the first step.','Votre score SCG est compétitif. Créer votre profil Entrée express est la première étape.')
        :T('Con un PNP obtendrías +600 puntos, casi garantizando la invitación.','With a PNP you would get +600 points, almost guaranteeing the invitation.','Avec un PNP vous obtiendriez +600 points, garantissant presque l\'invitation.'),
      tf:T('6–12 meses','6–12 months','6–12 mois')});}

  if(tr&&w>=2&&cen>=5)progs.push({id:'fstp',ico:'🔧',
    name:T('Express Entry – Federal Skilled Trades Program (FSTP)','Express Entry – Federal Skilled Trades Program (FSTP)','Entrée express – Programme des métiers spécialisés fédéraux (PMSF)'),
    st:'eligible',
    desc:T('Para electricistas, cocineros, soldadores, mecánicos y otros oficios calificados (NOC TEER 2-3).','For electricians, cooks, welders, mechanics, and other skilled tradespeople (NOC TEER 2-3).','Pour les électriciens, cuisiniers, soudeurs, mécaniciens et autres métiers qualifiés (CNP TEER 2-3).'),
    tip:T('Requieres inglés CLB 5 + oferta de trabajo O certificado de calificación en tu oficio.','Requires English CLB 5 + job offer OR a certificate of qualification in your trade.','Requiert anglais CLB 5 + offre d\'emploi OU certificat de qualification dans votre métier.'),
    tf:T('6–12 meses','6–12 months','6–12 mois')});

  if(sk&&w>=1&&cen>=4){
    let det='';
    if(['any','ab'].includes(pv))det+=T('Alberta (AAIP): muy activo en 2026, acepta CRS desde ~300. ','Alberta (AAIP): very active in 2026, accepts CRS from ~300. ','Alberta (AAIP): très actif en 2026, accepte SCG depuis ~300. ');
    if(['any','mb'].includes(pv))det+=T('Manitoba (MPNP): acepta perfiles medios de CRS. ','Manitoba (MPNP): accepts mid-range CRS profiles. ','Manitoba (MPNP): accepte des profils SCG moyens. ');
    if(['any','sk'].includes(pv))det+=T('Saskatchewan (SINP): oficios y profesionales, muy activo. ','Saskatchewan (SINP): trades and professionals, very active. ','Saskatchewan (SINP): métiers et professionnels, très actif. ');
    if(['any','bc'].includes(pv))det+=T('BC PNP: tecnología, salud, construcción. ','BC PNP: technology, healthcare, construction. ','PNP-CB: technologie, santé, construction. ');
    if(['any','on'].includes(pv))det+=T('OINP (Ontario): Human Capital Priorities requiere CRS ~400+. ','OINP (Ontario): Human Capital Priorities requires CRS ~400+. ','OINP (Ontario): Priorités en capital humain exige SCG ~400+. ');
    if(pv==='at')det=T('Considera el Atlantic Immigration Program (AIP) especialmente.','Consider the Atlantic Immigration Program (AIP) especially.','Envisagez particulièrement le Programme d\'immigration atlantique (PIA).');
    progs.push({id:'pnp',ico:'🏔️',
      name:T('Programa Nominado Provincial (PNP)','Provincial Nominee Program (PNP)','Programme des candidats des provinces (PCP)'),
      st:crs.total>=300?'eligible':'possible',
      desc:T('Una nominación provincial te da automáticamente +600 puntos CRS, casi garantizando una Invitación a Aplicar.','A provincial nomination automatically gives you +600 CRS points, almost guaranteeing an Invitation to Apply.','Une nomination provinciale vous donne automatiquement +600 points SCG, garantissant presque une Invitation à présenter une demande.'),
      det,tip:crs.total<470?T('Con tu puntaje actual, el PNP es probablemente tu MEJOR estrategia.','With your current score, PNP is probably your BEST strategy.','Avec votre score actuel, le PCP est probablement votre MEILLEURE stratégie.')
        :T('El PNP acelera enormemente el proceso.','PNP greatly accelerates the process.','Le PCP accélère énormément le processus.'),
      tf:T('12–18 meses total','12–18 months total','12–18 mois au total')});}

  if(['at','any'].includes(pv)&&sk&&w>=1)progs.push({id:'aip',ico:'🌊',
    name:T('Atlantic Immigration Program (AIP)','Atlantic Immigration Program (AIP)','Programme d\'immigration atlantique (PIA)'),
    st:'possible',
    desc:T('Para Nueva Escocia, Nuevo Brunswick, PEI y Terranova. Necesitas una oferta de un empleador designado.','For Nova Scotia, New Brunswick, PEI and Newfoundland. You need a job offer from a designated employer.','Pour la Nouvelle-Écosse, le Nouveau-Brunswick, l\'ÎPÉ et T.-N.-L. Vous avez besoin d\'une offre d\'emploi d\'un employeur désigné.'),
    tip:T('Uno de los caminos MÁS RÁPIDOS (6-12 meses). Menor costo de vida, excelente calidad de vida. Busca empleadores en atlanticimmigration.ca.',
      'One of the FASTEST pathways (6-12 months). Lower cost of living, excellent quality of life. Find employers at atlanticimmigration.ca.',
      'L\'une des voies LES PLUS RAPIDES (6-12 mois). Coût de la vie moins élevé, excellente qualité de vie. Trouvez des employeurs sur atlanticimmigration.ca.'),
    tf:T('6–12 meses','6–12 months','6–12 mois')});

  if(pv==='qc'||cfr>=7)progs.push({id:'qc',ico:'⚜️',
    name:T('Quebec Skilled Worker Program (QSWP)','Quebec Skilled Worker Program (QSWP)','Programme des travailleurs qualifiés du Québec (PTQQ)'),
    st:cfr>=7?'eligible':'possible',
    desc:T('Quebec tiene su propio sistema de selección, independiente de Express Entry. El francés es una gran ventaja.','Quebec has its own selection system, independent of Express Entry. French is a huge advantage.','Le Québec a son propre système de sélection, indépendant d\'Entrée express. Le français est un grand avantage.'),
    tip:cfr>=7?T('Tu nivel de francés te da una ventaja muy significativa para Quebec.','Your French level gives you a very significant advantage for Quebec.','Votre niveau de français vous donne un avantage très significatif pour le Québec.')
      :T('Si aprendes francés a nivel intermedio (CLB 7), Quebec se vuelve una opción muy viable.','If you learn French to intermediate level (CLB 7), Quebec becomes a very viable option.','Si vous apprenez le français à un niveau intermédiaire (CLB 7), le Québec devient une option très viable.'),
    tf:T('18–24 meses','18–24 months','18–24 mois')});

  if(age<=38&&cen>=5)progs.push({id:'study',ico:'🎓',
    name:T('Estudios en Canadá → PGWP → Residencia Permanente','Study in Canada → PGWP → Permanent Residence','Études au Canada → PTDG → Résidence permanente'),
    st:'possible',
    desc:T('Estudiar 2+ años en una institución DLI → Post-Graduation Work Permit (hasta 3 años) → CEC → PR. Muchos latinoamericanos logran PR en 3-4 años por esta ruta.',
      'Study 2+ years at a DLI institution → Post-Graduation Work Permit (up to 3 years) → CEC → PR. Many immigrants get PR in 3-4 years via this route.',
      'Étudier 2+ ans dans un établissement DLI → Permis de travail post-diplôme (jusqu\'à 3 ans) → CEC → RP. De nombreux immigrants obtiennent la RP en 3-4 ans par cette voie.'),
    tip:T('Puedes trabajar 20 hrs/semana durante estudios y tiempo completo con el PGWP. Colleges como BCIT, Humber, George Brown tienen excelentes programas técnicos.',
      'You can work 20 hrs/week during studies and full-time with the PGWP. Colleges like BCIT, Humber, George Brown have excellent technical programs.',
      'Vous pouvez travailler 20h/sem pendant les études et à temps plein avec le PTDG. Des collèges comme BCIT, Humber, George Brown ont d\'excellents programmes.'),
    tf:T('3–4 años total','3–4 years total','3–4 ans au total')});

  if(progs.filter(p=>p.st==='eligible').length===0){
    const tips=[];
    if(cen<7)tips.push(T('Mejorar inglés al nivel B2 (CLB 7-8) tiene el mayor impacto posible. Un curso intensivo puede lograrlo en 6-12 meses.','Improving English to B2 level (CLB 7-8) has the biggest possible impact. An intensive course can achieve this in 6-12 months.','Améliorer l\'anglais au niveau B2 (CLB 7-8) a le plus grand impact possible. Un cours intensif peut y parvenir en 6-12 mois.'));
    if(cfr<5)tips.push(T('Aprender francés básico-intermedio abre Quebec y da hasta 25-50 puntos extra en CRS.','Learning basic-intermediate French opens Quebec and gives up to 25-50 extra CRS points.','Apprendre le français de base à intermédiaire ouvre le Québec et donne jusqu\'à 25-50 points SCG supplémentaires.'));
    if(!sk)tips.push(T('Certificarte en un campo calificado (TEER 0-3) es la clave para Express Entry.','Certifying in a skilled field (TEER 0-3) is the key to Express Entry.','Se certifier dans un domaine qualifié (TEER 0-3) est la clé pour Entrée express.'));
    if(w<2)tips.push(T('Acumular 2-3 años de experiencia calificada mejora significativamente tus puntos.','Accumulating 2-3 years of skilled experience significantly improves your points.','Accumuler 2-3 ans d\'expérience qualifiée améliore significativement vos points.'));
    progs.push({id:'improve',ico:'📈',
      name:T('Pasos para mejorar tu candidatura','Steps to improve your candidacy','Étapes pour améliorer votre candidature'),
      st:'info',desc:T('Con tu perfil actual, hay acciones concretas que cambiarían significativamente tus posibilidades:','With your current profile, there are concrete actions that would significantly change your chances:','Avec votre profil actuel, il y a des actions concrètes qui changeraient significativement vos chances:'),
      tips,tf:''});}
  return progs;
}

function sysPrompt(a,results,lang){
  const score=results?.crs?.total||0;
  const progs=results?.programs?.map(p=>p.name).join(', ')||'';
  const LANG_INST=lang==='en'?'Always respond in English.':lang==='fr'?'Réponds toujours en français.':'Responde siempre en español latinoamericano sencillo.';
  return`You are a Canada immigration advisor. ${LANG_INST} Be empathetic, honest and want to empower people to navigate the immigration system without paying expensive consultants.

USER PROFILE: Age:~${a.age} | Marital:${a.marital}${a.spouse?'/spouse:'+a.spouse:''} | Education:${a.edu} | English:${a.english} | French:${a.french} | Occupation:${a.occ} | WorkYears:${a.workYears} | CanadaWork:${a.canWork}yrs | Province:${a.prov} | CRS:~${score}/1200
Programs identified: ${progs}

KEY FACTS 2025-2026: Express Entry draws: general ~470-510 CRS, category-based ~430-480. PNP: +600pts nomination, Alberta AAIP active (CRS 300+), Manitoba MPNP good for mid scores, Saskatchewan SINP active, 91,500 nominations in 2026 (up from 55,000 in 2025). Since March 2025: job offers NO LONGER give CRS points. AIP: designated employer offer needed, 6-12 months. Family: spouse ~12m, parents ~24m lottery. Study path: 2+yr DLI→PGWP→CEC. Quebec: own system (QSWP), French major advantage. COSTS: EE profile=FREE, PR application=~$1,365 CAD, IELTS=~$300 USD, ECA=~$250 CAD, total without consultant=$800-1,500 USD. TRUTH: most people can apply ALONE at canada.ca. Only hire consultants registered at college-ic.ca.
Give concise answers (3-5 paragraphs or bullets). Don't guarantee results. Mention canada.ca as free official source.`;
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function LangSelect({onSelect}){
  const [idx,setIdx]=useState(0);
  const [vis,setVis]=useState(true);
  useEffect(()=>{
    const id=setInterval(()=>{
      setVis(false);
      setTimeout(()=>{setIdx(i=>(i+1)%GREETINGS.length);setVis(true);},350);
    },2000);
    return()=>clearInterval(id);
  },[]);
  const g=GREETINGS[idx];
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(150deg,#082016 0%,#0f3d24 55%,#1a6b3e 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px'}}>
      <style>{STYLE}</style>
      <div style={{textAlign:'center',marginBottom:52,minHeight:150,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{opacity:vis?1:0,transform:vis?'translateY(0) scale(1)':'translateY(-14px) scale(0.92)',transition:'all 0.35s cubic-bezier(.4,0,.2,1)'}}>
          <div style={{fontFamily:'Lora,serif',fontSize:'clamp(68px,14vw,104px)',color:'#fff',fontWeight:700,lineHeight:1,letterSpacing:'-2px'}}>{g.w}</div>
          <div style={{color:'rgba(255,255,255,0.42)',fontSize:14,marginTop:10,fontWeight:600,letterSpacing:'3px',textTransform:'uppercase'}}>{g.l}</div>
        </div>
      </div>
      <div style={{textAlign:'center',marginBottom:40}}>
        <div style={{color:'rgba(255,255,255,0.9)',fontSize:17,fontWeight:600,marginBottom:8}}>🍁 Canada Immigration Advisor</div>
        <div style={{color:'rgba(255,255,255,0.5)',fontSize:13}}>Choose · Elige · Choisissez</div>
      </div>
      <div style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center'}}>
        {[{k:'es',f:'🇪🇸',l:'Español'},{k:'en',f:'🇬🇧',l:'English'},{k:'fr',f:'🇫🇷',l:'Français'}].map(({k,f,l})=>(
          <button key={k} onClick={()=>onSelect(k)}
            style={{background:'rgba(255,255,255,0.1)',border:'1.5px solid rgba(255,255,255,0.22)',borderRadius:13,padding:'14px 28px',color:'#fff',fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:700,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',gap:10,transition:'all 0.2s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.22)';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='rgba(255,255,255,0.5)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='rgba(255,255,255,0.22)';}}>
            <span style={{fontSize:24}}>{f}</span>{l}
          </button>
        ))}
      </div>
    </div>
  );
}

function Welcome({tr,onStart}){
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(150deg,#082016 0%,#0f3d24 55%,#1a6b3e 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px'}}>
      <div style={{fontSize:52,marginBottom:14}}>🍁</div>
      <h1 style={{fontFamily:'Lora,serif',color:'#fff',fontSize:'clamp(22px,5vw,38px)',textAlign:'center',lineHeight:1.2,marginBottom:16,maxWidth:560}}>{tr.title}</h1>
      <p style={{color:'rgba(255,255,255,0.82)',textAlign:'center',fontSize:16,maxWidth:520,lineHeight:1.65,marginBottom:38}}>{tr.sub}</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:13,maxWidth:580,width:'100%',marginBottom:38}}>
        {[[tr.c1t,tr.c1d,'🎯'],[tr.c2t,tr.c2d,'💡'],[tr.c3t,tr.c3d,'🆓']].map(([t,d,e])=>(
          <div key={t} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:12,padding:'18px 16px'}}>
            <div style={{fontSize:26,marginBottom:8}}>{e}</div>
            <div style={{color:'#fff',fontWeight:700,fontSize:14,marginBottom:6}}>{t}</div>
            <div style={{color:'rgba(255,255,255,0.7)',fontSize:13,lineHeight:1.5}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={onStart} style={{background:'#fff',color:'#0f3d24',fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:800,fontSize:17,padding:'15px 44px',borderRadius:50,border:'none',cursor:'pointer',boxShadow:'0 4px 20px rgba(0,0,0,0.25)',transition:'transform 0.2s'}}
        onMouseEnter={e=>e.target.style.transform='translateY(-2px)'}
        onMouseLeave={e=>e.target.style.transform='translateY(0)'}>{tr.startBtn}</button>
      <p style={{color:'rgba(255,255,255,0.38)',fontSize:11,textAlign:'center',marginTop:18,maxWidth:400,lineHeight:1.5}}>{tr.disc}</p>
    </div>
  );
}

function Quiz({lang,tr,answers,setAnswers,onDone}){
  const [idx,setIdx]=useState(0);
  const [key,setKey]=useState(0);
  const qs=getQS(lang).filter(q=>!q.cond||q.cond(answers));
  const cur=qs[idx];
  const pct=Math.round((idx/qs.length)*100);
  const pick=(qid,val)=>{
    const na={...answers,[qid]:val};setAnswers(na);
    const nqs=getQS(lang).filter(q=>!q.cond||q.cond(na));
    if(idx+1<nqs.length){setTimeout(()=>{setIdx(i=>i+1);setKey(k=>k+1);},180);}
    else setTimeout(()=>onDone(na),200);
  };
  return(
    <div style={{minHeight:'100vh',background:'#f5f1ea',padding:'24px 16px',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{width:'100%',maxWidth:580,height:5,background:'#e5ddd0',borderRadius:3,marginBottom:30}}>
        <div style={{height:5,width:`${pct}%`,background:'linear-gradient(90deg,#0f3d24,#1a6b3e)',borderRadius:3,transition:'width 0.35s ease'}}/>
      </div>
      {cur&&(
        <div className="si" key={key} style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 20px rgba(15,61,36,0.09)',padding:'32px 28px',maxWidth:580,width:'100%'}}>
          <div style={{color:'#9ca3af',fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'1.2px',marginBottom:10}}>{tr.qof(idx+1,qs.length)}</div>
          <h2 style={{fontFamily:'Lora,serif',fontSize:'clamp(17px,2.8vw,22px)',color:'#111827',marginBottom:8,lineHeight:1.3}}>{cur.q}</h2>
          {cur.sub&&<p style={{color:'#4b5563',fontSize:13.5,marginBottom:22,lineHeight:1.55}}>{cur.sub}</p>}
          <div style={{display:'flex',flexDirection:'column',gap:9}}>
            {cur.opts.map(o=>(
              <button key={o.v+o.l} onClick={()=>pick(cur.id,o.v)}
                style={{background:'#f5f1ea',border:'2px solid #e5e0d5',borderRadius:11,padding:'13px 16px',textAlign:'left',cursor:'pointer',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:14.5,fontWeight:600,color:'#111827',display:'flex',alignItems:'center',gap:12,transition:'all 0.16s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#0f3d24';e.currentTarget.style.background='#e5f2ea';e.currentTarget.style.transform='translateX(4px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e0d5';e.currentTarget.style.background='#f5f1ea';e.currentTarget.style.transform='translateX(0)';}}>
                <span style={{fontSize:20,flexShrink:0,width:28,textAlign:'center'}}>{o.e}</span><span>{o.l}</span>
              </button>
            ))}
          </div>
          {idx>0&&<button onClick={()=>{setIdx(i=>i-1);setKey(k=>k+1);}} style={{background:'none',border:'none',color:'#9ca3af',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:13,cursor:'pointer',marginTop:18,padding:'6px 0'}}>{tr.back}</button>}
        </div>
      )}
    </div>
  );
}

function ScoreBar({label,pts,max,delay=0}){
  const [w,setW]=useState(0);
  useEffect(()=>{setTimeout(()=>setW((pts/max)*100),delay+100);},[]);
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
        <span style={{color:'#4b5563'}}>{label}</span>
        <span style={{fontWeight:700,color:'#0f3d24'}}>{pts} <span style={{color:'#9ca3af',fontWeight:400}}>/ {max}</span></span>
      </div>
      <div style={{height:5,background:'#ede8df',borderRadius:3,overflow:'hidden'}}>
        <div style={{height:5,width:`${w}%`,background:'#0f3d24',borderRadius:3,transition:'width 0.9s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
    </div>
  );
}

function ProgramCard({p,tr,delay=0}){
  const [vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),delay);},[]);
  const sc={eligible:{c:'#0f3d24',bg:'#e5f2ea',lbl:tr.eligible},possible:{c:'#b45309',bg:'#fef3c7',lbl:tr.possible},info:{c:'#c41e2a',bg:'#fdeced',lbl:tr.infoSt}};
  const s=sc[p.st]||sc.info;
  return(
    <div style={{opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(14px)',transition:'all 0.4s ease',background:'#fff',borderRadius:14,padding:'22px',marginBottom:13,boxShadow:'0 2px 14px rgba(15,61,36,0.07)',borderLeft:`4px solid ${s.c}`}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12}}>
        <span style={{fontSize:22,flexShrink:0}}>{p.ico}</span>
        <div>
          <div style={{fontWeight:700,fontSize:15,color:'#111827',marginBottom:5}}>{p.name}</div>
          <span style={{background:s.bg,color:s.c,fontSize:11.5,fontWeight:700,padding:'3px 10px',borderRadius:50}}>{s.lbl}</span>
          {p.tf&&<div style={{fontSize:11.5,color:'#9ca3af',marginTop:5}}>{tr.tf} {p.tf}</div>}
        </div>
      </div>
      <p style={{fontSize:13.5,color:'#4b5563',lineHeight:1.6,marginBottom:p.det||p.tip||p.tips?10:0}}>{p.desc}</p>
      {p.det&&<p style={{fontSize:13,color:'#374151',lineHeight:1.6,marginBottom:p.tip?10:0,padding:'10px 12px',background:'#fafaf8',borderRadius:8}}>{p.det}</p>}
      {p.tip&&<div style={{background:'#e5f2ea',borderRadius:8,padding:'10px 13px',fontSize:13,color:'#0f3d24',fontWeight:600}}>{tr.tipLbl} {p.tip}</div>}
      {p.tips&&p.tips.length>0&&<ul style={{listStyle:'none',padding:0}}>{p.tips.map((t,i)=><li key={i} style={{fontSize:13,color:'#4b5563',padding:'7px 0',borderBottom:i<p.tips.length-1?'1px solid #e5e0d5':'none',lineHeight:1.55}}>{t}</li>)}</ul>}
    </div>
  );
}

function Chat({tr,answers,results,apiKey}){
  const [msgs,setMsgs]=useState([{role:'assistant',content:tr.chatWelcome}]);
  const [inp,setInp]=useState('');const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[msgs]);
  const send=async(msg)=>{
    if(!msg.trim()||loading)return;
    const nm=[...msgs,{role:'user',content:msg}];setMsgs(nm);setInp('');setLoading(true);
    try{
      const key=apiKey||import.meta.env.VITE_ANTHROPIC_API_KEY||'';
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:sysPrompt(answers,results,tr===TR.en?'en':tr===TR.fr?'fr':'es'),messages:nm})});
      const d=await r.json();
      setMsgs([...nm,{role:'assistant',content:d.content?.[0]?.text||tr.errMsg}]);
    }catch{setMsgs([...nm,{role:'assistant',content:tr.errMsg}]);}
    setLoading(false);
  };
  return(
    <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 14px rgba(15,61,36,0.09)',overflow:'hidden',marginBottom:40}}>
      <div style={{background:'#0f3d24',padding:'18px 22px'}}>
        <div style={{fontFamily:'Lora,serif',color:'#fff',fontSize:18,fontWeight:700,marginBottom:3}}>🍁 {tr.chatTitle}</div>
        <div style={{color:'rgba(255,255,255,0.7)',fontSize:13}}>{tr.chatSub}</div>
      </div>
      <div style={{padding:'18px 20px',minHeight:180,maxHeight:360,overflowY:'auto',display:'flex',flexDirection:'column',gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{maxWidth:'85%',padding:'11px 14px',fontSize:14,lineHeight:1.6,whiteSpace:'pre-wrap',
            borderRadius:m.role==='user'?'12px 4px 12px 12px':'4px 12px 12px 12px',
            background:m.role==='user'?'#0f3d24':'#e5f2ea',
            color:m.role==='user'?'#fff':'#111827',
            alignSelf:m.role==='user'?'flex-end':'flex-start'}}>{m.content}</div>
        ))}
        {loading&&<div style={{maxWidth:'85%',padding:'11px 14px',borderRadius:'4px 12px 12px 12px',background:'#e5f2ea',color:'#9ca3af',fontSize:14,alignSelf:'flex-start'}}>{tr.writing}</div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:'10px 20px',borderTop:'1px solid #e5e0d5'}}>
        <div style={{fontSize:11.5,color:'#9ca3af',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:8}}>{tr.freqQ}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {tr.quickQs.map(q=>(
            <button key={q} onClick={()=>send(q)}
              style={{background:'#f5f1ea',border:'1px solid #e5e0d5',borderRadius:20,padding:'5px 13px',fontSize:12,cursor:'pointer',color:'#4b5563',fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:600,transition:'all 0.15s'}}
              onMouseEnter={e=>{e.target.style.borderColor='#0f3d24';e.target.style.color='#0f3d24';e.target.style.background='#e5f2ea';}}
              onMouseLeave={e=>{e.target.style.borderColor='#e5e0d5';e.target.style.color='#4b5563';e.target.style.background='#f5f1ea';}}>{q}</button>
          ))}
        </div>
      </div>
      <div style={{display:'flex',gap:10,padding:'14px 20px',borderTop:'1px solid #e5e0d5'}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(inp)}
          placeholder={tr.chatPlaceholder} disabled={loading}
          style={{flex:1,border:'2px solid #e5e0d5',borderRadius:10,padding:'11px 14px',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:14,background:'#f5f1ea',color:'#111827',transition:'border-color 0.2s'}}
          onFocus={e=>e.target.style.borderColor='#0f3d24'} onBlur={e=>e.target.style.borderColor='#e5e0d5'}/>
        <button onClick={()=>send(inp)} disabled={loading||!inp.trim()}
          style={{background:loading||!inp.trim()?'#ccc':'#0f3d24',color:'#fff',border:'none',borderRadius:10,padding:'11px 20px',fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:700,cursor:loading||!inp.trim()?'not-allowed':'pointer',fontSize:14,transition:'background 0.2s'}}
          onMouseEnter={e=>{if(!loading&&inp.trim())e.target.style.background='#1a6b3e';}}
          onMouseLeave={e=>{if(!loading&&inp.trim())e.target.style.background='#0f3d24';}}>{tr.sendBtn}</button>
      </div>
    </div>
  );
}

function Results({lang,tr,answers,onReset,apiKey}){
  const crs=calcCRS(answers),fswp=checkFSWP(answers);
  const programs=getPrograms(answers,crs,fswp,lang);
  const results={crs,fswp,programs};
  const pct=Math.min((crs.total/1200)*100,100);
  const [bw,setBw]=useState(0);
  useEffect(()=>{setTimeout(()=>setBw(pct),400);},[]);
  const cand=crs.total>=470?{lbl:tr.strong,bg:'rgba(255,255,255,0.92)',c:'#0f3d24'}
    :crs.total>=380?{lbl:tr.moderate,bg:'rgba(255,213,0,0.88)',c:'#7a5800'}
    :crs.total>=250?{lbl:tr.strategy,bg:'rgba(255,165,60,0.88)',c:'#7a3000'}
    :{lbl:tr.needs,bg:'rgba(255,255,255,0.2)',c:'#fff'};
  const bd=[{l:tr.bdAge,v:crs.bd.ag,m:110},{l:tr.bdEdu,v:crs.bd.ed,m:150},{l:tr.bdLang,v:crs.bd.lang,m:160},{l:tr.bdCan,v:crs.bd.cw,m:80},{l:tr.bdSkill,v:crs.bd.sk,m:100},{l:tr.bdAdd,v:crs.bd.add,m:65}];
  return(
    <div style={{minHeight:'100vh',background:'#f5f1ea',padding:'24px 16px 40px',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div className="fi" style={{background:'linear-gradient(135deg,#0f3d24,#1a6b3e)',borderRadius:14,padding:'32px 28px',maxWidth:620,width:'100%',marginBottom:20,textAlign:'center',color:'#fff'}}>
        <div style={{fontSize:12,opacity:0.7,marginBottom:8,letterSpacing:'1px',textTransform:'uppercase',fontWeight:700}}>🍁 Canada Immigration Advisor</div>
        <h2 style={{fontFamily:'Lora,serif',fontSize:'clamp(20px,4vw,30px)',marginBottom:20}}>{tr.evalTitle}</h2>
        <div style={{marginBottom:14}}>
          <span style={{fontSize:'clamp(52px,10vw,70px)',fontWeight:800,lineHeight:1}}>{crs.total}</span>
          <span style={{fontSize:19,opacity:0.6,marginLeft:4}}>/ 1,200 {tr.pts}</span>
        </div>
        <div style={{height:10,background:'rgba(255,255,255,0.2)',borderRadius:5,overflow:'hidden',marginBottom:12}}>
          <div style={{height:10,width:`${bw}%`,background:'white',borderRadius:5,transition:'width 1.1s cubic-bezier(.4,0,.2,1)'}}/>
        </div>
        <div style={{fontSize:12,opacity:0.6,marginBottom:18}}>{tr.crsNote}</div>
        <span style={{background:cand.bg,color:cand.c,padding:'8px 22px',borderRadius:50,fontWeight:700,fontSize:14,display:'inline-block'}}>{cand.lbl}</span>
      </div>
      <div style={{maxWidth:620,width:'100%'}}>
        <div style={{background:'#fff',borderRadius:14,padding:'22px 24px',marginBottom:18,boxShadow:'0 2px 14px rgba(15,61,36,0.07)'}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:16,color:'#111827'}}>📊 {tr.bdTitle}</div>
          {bd.map((it,i)=><ScoreBar key={it.l} label={it.l} pts={it.v} max={it.m} delay={i*70}/>)}
          <div style={{marginTop:14,padding:'10px 14px',background:'#e5f2ea',borderRadius:8,fontSize:13,color:'#0f3d24',fontWeight:600}}>{tr.approxNote}</div>
        </div>
        <h3 style={{fontFamily:'Lora,serif',fontSize:20,color:'#111827',marginBottom:14}}>{tr.progTitle}</h3>
        {programs.map((p,i)=><ProgramCard key={p.id} p={p} tr={tr} delay={i*70}/>)}
        <div style={{background:'#e5f2ea',borderRadius:12,padding:'16px 20px',marginBottom:18,fontSize:13,color:'#0f3d24',lineHeight:1.65}}>{tr.officialNote}</div>
        <Chat tr={tr} answers={answers} results={results} apiKey={apiKey}/>
        <button onClick={onReset} style={{background:'none',border:'1px solid #e5e0d5',borderRadius:8,padding:'10px 22px',cursor:'pointer',color:'#4b5563',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:14}}>{tr.restart}</button>
      </div>
    </div>
  );
}

// ── API KEY SETUP SCREEN ──────────────────────────────────────────────────────
function ApiKeySetup({onDone}){
  const [key,setKey]=useState('');
  const [err,setErr]=useState('');
  const check=()=>{
    if(!key.startsWith('sk-ant-')){setErr('The key should start with sk-ant-... Get yours at console.anthropic.com');return;}
    onDone(key.trim());
  };
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(150deg,#082016 0%,#0f3d24 55%,#1a6b3e 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px'}}>
      <style>{STYLE}</style>
      <div style={{fontSize:52,marginBottom:16}}>🍁</div>
      <h1 style={{fontFamily:'Lora,serif',color:'#fff',fontSize:'clamp(20px,4vw,32px)',textAlign:'center',marginBottom:12}}>Canada Immigration Advisor</h1>
      <p style={{color:'rgba(255,255,255,0.7)',textAlign:'center',fontSize:15,maxWidth:460,lineHeight:1.6,marginBottom:36}}>
        To enable the AI chat assistant, enter your Anthropic API key.<br/>
        <span style={{fontSize:13,opacity:0.6}}>The key stays in your browser session only — it's never stored or sent anywhere else.</span>
      </p>
      <div style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:14,padding:'28px 28px',maxWidth:460,width:'100%'}}>
        <label style={{color:'rgba(255,255,255,0.8)',fontSize:13,fontWeight:700,display:'block',marginBottom:8}}>ANTHROPIC API KEY</label>
        <input value={key} onChange={e=>{setKey(e.target.value);setErr('');}} placeholder="sk-ant-api03-..."
          style={{width:'100%',background:'rgba(255,255,255,0.08)',border:'1.5px solid rgba(255,255,255,0.2)',borderRadius:9,padding:'12px 14px',color:'#fff',fontFamily:'monospace',fontSize:14,marginBottom:err?8:16,outline:'none'}}
          onFocus={e=>e.target.style.borderColor='rgba(255,255,255,0.5)'}
          onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.2)'}
          onKeyDown={e=>e.key==='Enter'&&check()}/>
        {err&&<div style={{color:'#fca5a5',fontSize:12,marginBottom:12}}>{err}</div>}
        <button onClick={check} style={{width:'100%',background:'#fff',color:'#0f3d24',fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:800,fontSize:15,padding:'13px',borderRadius:9,border:'none',cursor:'pointer'}}>
          Continue →
        </button>
        <div style={{marginTop:16,textAlign:'center'}}>
          <a href="https://console.anthropic.com/keys" target="_blank" rel="noreferrer"
            style={{color:'rgba(255,255,255,0.5)',fontSize:12,textDecoration:'none'}}>
            Get a free API key at console.anthropic.com →
          </a>
        </div>
      </div>
      <div style={{marginTop:24,textAlign:'center'}}>
        <button onClick={()=>onDone('')} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:13,cursor:'pointer',textDecoration:'underline'}}>
          Continue without AI chat (calculator only)
        </button>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [apiKey,setApiKey]=useState(import.meta.env.VITE_ANTHROPIC_API_KEY||'');
  const [keySet,setKeySet]=useState(!!(import.meta.env.VITE_ANTHROPIC_API_KEY));
  const [lang,setLang]=useState(null);
  const [screen,setScreen]=useState('lang');
  const [answers,setAnswers]=useState({});
  const tr=TR[lang]||TR.es;
  const reset=()=>{setScreen('lang');setLang(null);setAnswers({});};
  if(!keySet)return<ApiKeySetup onDone={k=>{setApiKey(k);setKeySet(true);}}/>;
  if(screen==='lang')return<LangSelect onSelect={l=>{setLang(l);setScreen('welcome');}}/>;
  return(
    <>
      <style>{STYLE}</style>
      {screen==='welcome'&&<Welcome tr={tr} onStart={()=>setScreen('quiz')}/>}
      {screen==='quiz'&&<Quiz lang={lang} tr={tr} answers={answers} setAnswers={setAnswers} onDone={a=>{setAnswers(a);setScreen('results');}}/>}
      {screen==='results'&&<Results lang={lang} tr={tr} answers={answers} onReset={reset} apiKey={apiKey}/>}
    </>
  );
}
