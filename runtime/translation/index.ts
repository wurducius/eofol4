import { getEnv } from "../internals"
import { isBrowser } from "../util"
import { forceRerender } from "../stateful"
import { fetchGeneral } from "../fetch"

const env = getEnv()
const BASE_URL = env.BASE_URL
let TRANSLATION_ENABLED
let TRANSLATION_DEFAULT_LANGUAGE
let TRANSLATION_LANGUAGES
if (isBrowser()) {
  const config = env.config.env
  TRANSLATION_ENABLED = config.TRANSLATION_ENABLED
  TRANSLATION_DEFAULT_LANGUAGE = config.TRANSLATION_DEFAULT_LANGUAGE
  TRANSLATION_LANGUAGES = config.TRANSLATION_LANGUAGES
} else {
  TRANSLATION_ENABLED = false
  TRANSLATION_DEFAULT_LANGUAGE = "en"
  // @TODO changeit
  TRANSLATION_LANGUAGES = ["en", "cs"]
}

/*
import eofolConfig from "../../config/eofol-config"
else {
  TRANSLATION_ENABLED = eofolConfig.TRANSLATION_ENABLED
  TRANSLATION_DEFAULT_LANGUAGE = eofolConfig.TRANSLATION_DEFAULT_LANGUAGE
}
 */

// @TODO Fill language codelist with values, probably best to use some library codelist, also add country flag icons, use some kind of sorting
const LANGS = [
  { id: "en", title: "English" },
  { id: "cs", title: "Česky" },
]

const defaultLang = TRANSLATION_DEFAULT_LANGUAGE

let currentLang = defaultLang

let translation = {}

let langs = TRANSLATION_LANGUAGES.map((lang: string) => LANGS.find((langCodelist) => langCodelist.id === lang)).filter(
  Boolean,
)

let isCustomLang = currentLang !== defaultLang

const setTranslation = (content: Object) => {
  translation = content
}

const setIsCustomLang = () => {
  isCustomLang = currentLang !== defaultLang
}

const updateTranslation = () => {
  isBrowser() &&
    isCustomLang &&
    fetchGeneral(`${BASE_URL}translation/${currentLang}.json`)
      .then((x) => setTranslation(x))
      .then(() => {
        forceRerender()
      })
}

export const getLangs = () => langs

export const setCurrentLang = (lang: string) => {
  currentLang = lang
  setIsCustomLang()
  updateTranslation()
}

export const getCurrentLang = () => currentLang

if (isBrowser()) {
  const split = window.location.pathname.split("-")
  const langMutationExt = split[split.length - 1]
  const lang = langMutationExt.split(".")[0]
  setCurrentLang(langMutationExt !== "/" && lang !== "/" && langMutationExt && lang ? lang : defaultLang)
}

if (TRANSLATION_ENABLED) {
  updateTranslation()
}

export const t = (key: string, defaultValue: string) => {
  // @ts-ignore
  return isCustomLang ? translation[key] : defaultValue
}
