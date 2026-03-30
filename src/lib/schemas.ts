import { z } from "zod";
import { CONTEST_TYPE_IDS } from "./contestTypes";

export const createContestSchema = z.object({
  name: z
    .string({ required_error: "El nombre del concurso es obligatorio" })
    .trim()
    .min(1, "El nombre del concurso es obligatorio")
    .max(100, "El nombre del concurso debe tener 100 caracteres o menos"),
  contest_type: z
    .enum(CONTEST_TYPE_IDS as [string, ...string[]], {
      errorMap: () => ({ message: "Tipo de concurso no válido" }),
    })
    .default("tortillas"),
  items: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(80, "El nombre del participante supera los 80 caracteres")
    )
    .min(1, "Debes añadir al menos un participante"),
});

export const submitVoteSchema = z.object({
  contest_id: z
    .string({ required_error: "El campo contest_id es obligatorio" })
    .uuid("El campo contest_id debe ser un UUID válido"),
  guest_name: z
    .string({ required_error: "El campo guest_name es obligatorio" })
    .trim()
    .min(1, "El campo guest_name es obligatorio")
    .max(50, "El nombre debe tener 50 caracteres o menos"),
  item_name: z
    .string({ required_error: "El campo item_name es obligatorio" })
    .trim()
    .min(1, "El campo item_name es obligatorio"),
  scores_json: z
    .record(
      z.string(),
      z
        .number()
        .int("La puntuación debe ser un número entero")
        .min(1, "La puntuación mínima es 1")
        .max(10, "La puntuación máxima es 10")
    )
    .refine((v) => Object.keys(v).length > 0, {
      message: "scores_json debe ser un objeto no vacío",
    }),
});
