// script.js
// Voor didactisch gebruik aangepast door Robbe Wulgaert, Sint‑Lievenscollege Gent / AI in de Klas. Niet verspreiden zonder naamsvermelding

const rubric = [
  { crit: "Naam systeem / ontwerp", desc: ["Je bedacht een gepaste en originele naam.","-","–","Je bedacht geen naam."], weightPct: 5 },
  { crit: "Logo systeem / ontwerp",   desc: ["Je creëerde een eigen logo of paste een gegenereerd logo verder aan. Het logo is duidelijk.","-","Je creëerde een logo met AI. Het logo is onduidelijk.","Je creëerde geen logo."], weightPct: 5 },
  { crit: "Huisstijl",                desc: ["Je paste een duidelijke en consequente huisstijl toe. Het prototype/de app is overzichtelijk ontworpen.","Je paste een huisstijl toe, maar die is niet altijd consequent. Verzamel feedback en pas aan.","Op sommige pagina’s is er een huisstijl, maar niet consequent. Denk aan beeldstijl, typografie, vormentaal en kleur.","Huisstijl is volledig zoek. Denk aan beeldstijl, typografie, vormentaal en kleur."], weightPct: 10 },
  { crit: "Persona & probleem",        desc: ["De persona en het probleem worden duidelijk uitgelegd in woord en beeld.","De persona werd toegelicht.","De persona werd onvoldoende uitgelegd.","De persona en het probleem kwamen niet duidelijk aan bod."], weightPct: 20 },
  { crit: "Theorie ML uitleg",        desc: ["Je legt duidelijk uit hoe het model getraind wordt (type ML, bv. supervised, GAN, etc.). Toepassing op eigen model + gevaren benoemd.","Je legt algemeen uit welk type ML gebruikt wordt, maar past dit nog niet toe op je eigen AI-systeem.","Je vermeldt het soort model, maar legt het niet uit. Tip: zoek in je notities naar gelijkaardige AI-systemen.","Geen uitleg of volledig fout. Tip: raadpleeg notities over gelijkaardige systemen."], weightPct: 25 },
  { crit: "Relevantie AI‑oplossing",   desc: ["Je ontwierp een AI‑toepassing die duidelijk en gepast aansluit bij het probleem van de gebruiker.","-","Je ontwierp een AI‑oplossing die mogelijk relevant is, maar het verband met het kernprobleem is nog onduidelijk.","Je ontwierp geen oplossing met de AI‑technieken die we hebben geleerd en toegepast doorheen de leerlijn."], weightPct: 10 },
  { crit: "Articulatie",              desc: ["Je spreekt zeer helder, articuleert goed, gebruikt intonatie en spreekt het publiek aan. Geen notitiebladjes nodig.","Je spreekt luid en duidelijk, maar niet altijd richting het publiek.","Je spreekt niet altijd richting het publiek. Oefen voldoende.","Je sprak onduidelijk en had nauwelijks contact met het publiek."], weightPct: 20 },
  { crit: "Houding",                  desc: ["Je hebt voortdurend oogcontact, staat stevig, handen uit de zakken, open houding.","Je hebt oogcontact en staat goed, maar de houding is gesloten of je beweegt nerveus. Oefen met feedback van anderen.","Je hebt sporadisch oogcontact, gesloten houding of zichtbare zenuwen die de presentatie storen.","Geen oogcontact, onzekere houding. Oefen voldoende vooraf."], weightPct: 5 },
];

const MAX_POINTS   = 40;
const SELECT_PROB  = 0.33;       // 33% kans
const mainContent  = document.getElementById("main-content");
const overlay      = document.getElementById("overlay");
const closeModal   = overlay.querySelector(".close-btn");

function makeCell(txt, header=false) {
  const c = header ? document.createElement("th") : document.createElement("td");
  c.innerHTML = `<small>${txt}</small>`;
  return c;
}
function makeScoreCell(text, _, lvl, wPct) {
  const cell = document.createElement("td");
  cell.setAttribute("role","button");
  cell.setAttribute("aria-selected","false");
  cell.classList.add("score-cell");
  cell.innerHTML = `<small>${text}</small>`;
  cell.addEventListener("click", () => selectScore(cell, wPct, lvl));
  return cell;
}
function selectScore(cell, wPct, lvl) {
  const row = cell.parentNode;
  row.querySelectorAll("td.score-cell").forEach(c => {
    c.setAttribute("aria-selected","false");
    c.removeAttribute("selected");
  });
  cell.setAttribute("aria-selected","true");
  cell.setAttribute("selected","true");

  // punten per rij: weightPct% van MAX_POINTS, geschaald door (3-lvl)/3
  const ptsMax = (wPct/100)*MAX_POINTS;
  const ratio  = (3 - lvl)/3;
  const pts    = parseFloat((ptsMax * ratio).toFixed(1));
  row.dataset.points = pts;

  row.querySelector(".score-result-pct").textContent = Math.round(ratio*100)+"%";
  row.querySelector(".score-result-pt").textContent  = pts + " pt";

  updateTotalScore();
}
function updateTotalScore() {
  let sum = 0;
  document.querySelectorAll("tbody tr").forEach(r => {
    sum += parseFloat(r.dataset.points||0);
  });
  const pct = Math.round((sum/MAX_POINTS)*100);
  document.getElementById("total-score").textContent =
    `Totale score: ${sum.toFixed(1)} / ${MAX_POINTS} (${pct}%)`;
}

function buildRubricTable() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("rubric-wrapper");
  const table = document.createElement("table");

  // header
  const thead = table.createTHead();
  const hr = thead.insertRow();
  hr.appendChild(makeCell("Criteria", true));
  ["Uitstekend","Goed","Redelijk","Onvoldoende"].forEach(t => hr.appendChild(makeCell(t, true)));
  hr.appendChild(makeCell("Gewicht", true));
  hr.appendChild(makeCell("Score %", true));
  hr.appendChild(makeCell("Punten", true));

  // body
  const tbody = table.createTBody();
  rubric.forEach((r,i) => {
    const tr = tbody.insertRow();
    tr.appendChild(makeCell(r.crit));
    r.desc.forEach((d,j) => tr.appendChild(makeScoreCell(d, i, j, r.weightPct)));
    tr.insertCell().textContent = r.weightPct + "%";
    const pctCell = document.createElement("td");
    pctCell.classList.add("score-result-pct");
    pctCell.textContent = "–";
    tr.appendChild(pctCell);
    const ptCell = document.createElement("td");
    ptCell.classList.add("score-result-pt");
    ptCell.textContent = "–";
    tr.appendChild(ptCell);
    tr.dataset.points = 0;
  });

  wrapper.appendChild(table);
  document.getElementById("rubric-container").replaceWith(wrapper);
}

function showOverlay()       { overlay.classList.add("active"); }
function hideOverlay()       { overlay.classList.remove("active"); }
function submitScores() {
  const evNaam = document.getElementById("evaluator-name").value.trim();
  const prNaam = document.getElementById("presenter-names").value.trim();
  const rows   = document.querySelectorAll("tbody tr");
  const allSel = Array.from(rows).every(r => r.querySelector("td[selected]"));
  if (!evNaam || !prNaam || !allSel) {
    alert("Vul jouw naam, de presentatoren en alle scores in.");
    return;
  }
  showOverlay();
}
function submitFeedback() {
  hideOverlay();
  const chosen = Math.random() < SELECT_PROB;
  document.body.classList.add(chosen ? "selected" : "not-selected");

  // ✓ of ✗
  const mark = document.createElement("div");
  mark.className = "selection-mark " + (chosen ? "selected" : "not-selected");
  mark.textContent = chosen ? "✓" : "✗";
  mainContent.appendChild(mark);

  // toon web‑overzicht
  const overview = document.getElementById("web-overzicht");
  const total    = document.getElementById("total-score").textContent;
  const fbGood   = document.getElementById("fb-good").value.trim();
  const fbBetter = document.getElementById("fb-better").value.trim();
  const fbOther  = document.getElementById("fb-other").value.trim();
  overview.innerHTML = `
    <h3>Overzicht</h3>
    <p><strong>Evaluator:</strong> ${document.getElementById("evaluator-name").value}</p>
    <p><strong>Presentatoren:</strong> ${document.getElementById("presenter-names").value}</p>
    <p><strong>${total}</strong></p>
    <p><strong>Wat ging goed:</strong> ${fbGood}</p>
    <p><strong>Wat kan beter:</strong> ${fbBetter}</p>
    <p><strong>Opmerkingen:</strong> ${fbOther}</p>
  `;

  if (chosen) addExportButton();
  else alert("Jouw evaluatie wordt niet geselecteerd voor de eindbeoordeling.");
}

function addExportButton() {
  const btn = document.createElement("button");
  btn.id = "export-overzicht";
  btn.textContent = "Exporteer overzicht als PNG";
  mainContent.appendChild(btn);
  btn.addEventListener("click", exportToPNG);
}

function exportToPNG() {
  html2canvas(mainContent).then(canvas => {
    // combineer canvas + metadata
    const w = canvas.width, h = canvas.height + 140;
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    const ctx = off.getContext("2d");
    ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = "#000";
    ctx.font = "12px Roboto";
    const y0 = canvas.height + 20;
    ctx.fillText(document.getElementById("web-overzicht").innerText, 10, y0);

    const link = document.createElement("a");
    link.download = "overzicht.png";
    link.href = off.toDataURL();
    link.click();
  });
}

// initialisatie
buildRubricTable();
document.getElementById("submit-scores")
        .addEventListener("click", submitScores);
document.getElementById("submit-feedback")
        .addEventListener("click", submitFeedback);
closeModal.addEventListener("click", hideOverlay);
overlay.addEventListener("click", e => { if (e.target === overlay) hideOverlay(); });
