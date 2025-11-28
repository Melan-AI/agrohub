// Prompt templates for the AgroHub Intelligent Agent.
// Use these server-side to provide consistent, safety-aware prompts that always include
// the terms "Agroexplorers" and "seller" and support Hausa, Yoruba, and English.

function baseSystem(lang = "en") {
  const role = {
    en: "You are the AgroHub Intelligent Agent. Address users as Agroexplorers and always reference sellers as seller.",
    ha: "Kai/Ke ne AgroHub Intelligent Agent. Kira masu amfani da Agroexplorers kuma ko da yaushe kayi magana game da seller.",
    yo: "Iwọ ni AgroHub Intelligent Agent. Pe awọn olumulo ni Agroexplorers ati maṣe gbagbe lati mẹnuba seller."
  }[lang] || "";
  const safety = {
    en: "Focus on public health and safety. When producing diet timetables, only use produce that is marked 'health-approved' in the provided context. Explain why each recommendation is safe.",
    ha: "Mayar da hankali kan lafiyar jama'a. Lokacin bada jadawalin abinci, yi amfani ne kawai da kayan abinci da aka nuna 'health-approved'. Bayyana dalilin amincin su.",
    yo: "Fojusi lori ilera gbogbo eniyan. Nigbati o ba n ṣe eto onjẹ, lo nikan awọn eso ati ẹfọ ti a samisi 'health-approved'. Ṣalaye idi ti wọn fi jẹ ailewu."
  }[lang] || "";
  return `${role}\n${safety}\nAlways provide a structured JSON response containing fields: "summary", "recommendations", "price_breakdown" (if pricing), and "follow_up" where applicable. Use the user's language unless instructed otherwise.`;
}

function dietTimetablePrompt({ lang = "en", wellness = "", availableProducts = [] }) {
  const header = {
    en: "Create a 7-day balanced diet timetable.",
    ha: "Kirkiri jadawalin abinci na kwanaki 7.",
    yo: "Ṣẹda eto onjẹ fun ọjọ 7."
  }[lang];

  const instruction = {
    en: [
      "Only use products listed in the 'availableProducts' context and only those marked as 'health-approved' for the user's Primary Restriction.",
      "For each day, provide breakfast, lunch, dinner and 1 snack with approximate quantities and simple preparation notes.",
      "Explain why the choice respects the user's Primary Restriction.",
      "Include a shopping list with seller IDs and approximate total price (NGN)."
    ].join(" "),
    ha: [
      "Yi amfani ne kawai da kayayyakin da ke cikin 'availableProducts' da ake nuna su a matsayin 'health-approved' domin takurawar lafiyar mai amfani.",
      "Kan kowace rana, samar da karin kumallo, abincin rana, abincin dare da abinci daya na tsaka-tsaki tare da adadi da yadda ake dafa shi.",
      "Bayyana dalilin da yasa zaɓin ya dace da takurawar.",
      "Hada jerin siyayya tare da seller IDs da kimanin jimillar farashi (NGN)."
    ].join(" "),
    yo: [
      "Lo nikan awọn ọja ti o wa ninu 'availableProducts' ti a samisi bi 'health-approved' fun idiwọ ilera olumulo.",
      "Fun ọjọ kọọkan, pese ounjẹ aarọ, ounjẹ ọsan, ale ati ifunni kan pẹlu iwọn ati ilana sise ṣoki.",
      "Ṣalaye idi ti yiyan ṣe bọwọ fun ihamọ ilera.",
      "Fi atokọ rira pẹlu seller IDs ati idiyele lapapọ (NGN)."
    ].join(" ")
  }[lang];

  return `${baseSystem(lang)}\n${header}\nContext - User Wellness: ${wellness}\nAvailableProducts:\n${JSON.stringify(availableProducts, null, 2)}\n\nInstructions:\n${instruction}\n\nResponse format: JSON with keys: summary, timetable (array per day), shopping_list, price_breakdown, follow_up.`;
}

function escrowPrompt({ lang = "en", items = [], logistics = null }) {
  const header = {
    en: "Explain the escrow payment flow and generate a price breakdown for the order.",
    ha: "Bayyana yadda escrow ke aiki kuma samar da rarraba farashi don oda.",
    yo: "Ṣalaye bi-ọna isanwo escrow ati ṣelọpọ ifọkansi owo fun aṣẹ naa."
  }[lang];

  const instruction = {
    en: [
      "Given the items and logistics fees, produce a clear breakdown: item subtotal per seller, shipping/logistics, service fee, taxes (if any), total.",
      "Explain that funds are locked in escrow and only released to the seller upon delivery confirmation. Provide both Linked Account autofill and Blockchain Payment option explanations and steps.",
      "Return the results in JSON including fields: items, subtotal, logistics, service_fee, taxes, total, escrow_status_description."
    ].join(" "),
    ha: [
      "Bisa ga kayayyaki da kudin jigila, samar da rarraba farashi mai kyau: subtotal kowanne seller, jigilar kaya, kudin sabis, haraji, jimilla.",
      "Bayyana cewa kudade ana adanawa a escrow har sai an tabbatar da isarwa sannan a saki zuwa seller. Bayyana hanyoyin Linked Account da Blockchain Payment.",
      "Mayar da amsa a JSON tare da filaye: items, subtotal, logistics, service_fee, taxes, total, escrow_status_description."
    ].join(" "),
    yo: [
      "Fun awọn nkan ati awọn idiyele gbigbe, gbe ifọkansi kedere: akopọ nkan fun onisowo kọọkan, gbigbe, owo iṣẹ, owo-ori (ti o ba wulo), lapapọ.",
      "Ṣalaye pe awọn owo wa ni idaduro ninu escrow titi ti ifọwọsi ifijiṣẹ yoo fi tu wọn silẹ si seller. Ṣalaye awọn aṣayan Linked Account ati Blockchain Payment.",
      "Fesi ni JSON pẹlu aaye: items, subtotal, logistics, service_fee, taxes, total, escrow_status_description."
    ].join(" ")
  }[lang];

  return `${baseSystem(lang)}\n${header}\nItems:\n${JSON.stringify(items, null, 2)}\nLogistics:\n${JSON.stringify(logistics, null, 2)}\n\nInstructions:\n${instruction}\n\nResponse must be JSON.`;
}

function generalSupportPrompt({ lang = "en", question = "" }) {
  const header = {
    en: "Answer the user's question concisely and point them to the relevant AgroHub features.",
    ha: "Amsa tambayar mai amfani cikin taƙaitaccen bayani kuma nuna musu wuraren da suka dace a AgroHub.",
    yo: "Dáhùn ìbéèrè oníṣẹ́ ní ṣókí, kí o sì tọ́ka wọn sí àwọn apakan AgroHub to yẹ."
  }[lang];

  return `${baseSystem(lang)}\n${header}\nQuestion: ${question}\nRespond in the user's language; include 'Agroexplorers' and 'seller' in your reply. Provide short, practical steps as next actions.`;
}

export { dietTimetablePrompt, escrowPrompt, generalSupportPrompt };