import { Lang } from "./types"

const English = { id: "en", title: "English" }
const Czech = { id: "cs", title: "Česky" }
const German = { id: "de", title: "Deutsch" }

// @TODO Fill language codelist with values, probably best to use some library codelist, also add country flag icons, use some kind of sorting
export const LANGS: Lang[] = [English, Czech, German]

export const DEFAULT_LANG: Lang = English
