const CONTEST_TEMPLATES = [
  {
    id: "tortillas",
    label: "Tortillas",
    emoji: "🍳",
    criteria: ["Sabor", "Presentación", "Jugosidad"]
  },
  {
    id: "croquetas",
    label: "Croquetas",
    emoji: "🍘",
    criteria: ["Sabor", "Crujiente", "Textura"]
  },
  {
    id: "color",
    label: "Comida por Color",
    emoji: "🌈",
    criteria: ["Originalidad", "Sabor", "Presentación"]
  },
  {
    id: "inicial",
    label: "Comida por Inicial",
    emoji: "🔤",
    criteria: ["Originalidad", "Sabor", "Presentación"]
  }
];
const CONTEST_TYPE_IDS = CONTEST_TEMPLATES.map((t) => t.id);
function getTemplate(contestType) {
  return CONTEST_TEMPLATES.find((t) => t.id === contestType) ?? CONTEST_TEMPLATES[0];
}
function getCriteria(contestType) {
  return getTemplate(contestType).criteria;
}

export { CONTEST_TYPE_IDS as C, getCriteria as a, CONTEST_TEMPLATES as b, getTemplate as g };
