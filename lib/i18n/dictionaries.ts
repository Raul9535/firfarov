import en from "./dictionaries/en";
import ru from "./dictionaries/ru";
import type { Locale } from "./config";

const dictionaries = { en, ru } as const;

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
