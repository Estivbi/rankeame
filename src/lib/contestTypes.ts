export type ContestType = "tortillas" | "croquetas" | "color" | "inicial";

export interface ContestTemplate {
  id: ContestType;
  label: string;
  emoji: string;
  criteria: string[];
}

export const CONTEST_TEMPLATES: ContestTemplate[] = [
  {
    id: "tortillas",
    label: "Tortillas",
    emoji: "🍳",
    criteria: ["Sabor", "Presentación", "Jugosidad"],
  },
  {
    id: "croquetas",
    label: "Croquetas",
    emoji: "🍘",
    criteria: ["Sabor", "Crujiente", "Textura"],
  },
  {
    id: "color",
    label: "Comida por Color",
    emoji: "🌈",
    criteria: ["Originalidad", "Sabor", "Presentación"],
  },
  {
    id: "inicial",
    label: "Comida por Inicial",
    emoji: "🔤",
    criteria: ["Originalidad", "Sabor", "Presentación"],
  },
];

export const CONTEST_TYPE_IDS: ContestType[] = CONTEST_TEMPLATES.map((t) => t.id);

export function getTemplate(contestType: string): ContestTemplate {
  return CONTEST_TEMPLATES.find((t) => t.id === contestType) ?? CONTEST_TEMPLATES[0];
}

export function getCriteria(contestType: string): string[] {
  return getTemplate(contestType).criteria;
}
