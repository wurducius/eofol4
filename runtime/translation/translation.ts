import { getEnv } from "../internals"
import { isBrowser } from "../util"
import { forceRerender } from "../stateful"
import { fetchGeneral } from "../fetch"
import { DEFAULT_LANG, LANGS } from "./languages"
import { Translation, TranslationStorage } from "./types"
import { loadLocalStorage, saveLocalStorage } from "../storage"

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
  TRANSLATION_DEFAULT_LANGUAGE = DEFAULT_LANG.id
  // @TODO changeit
  TRANSLATION_LANGUAGES = LANGS.map((lang) => lang.id)
}

/*
import eofolConfig from "../../config/eofol-config"
else {
  TRANSLATION_ENABLED = eofolConfig.TRANSLATION_ENABLED
  TRANSLATION_DEFAULT_LANGUAGE = eofolConfig.TRANSLATION_DEFAULT_LANGUAGE
}
 */

const TRANSLATION_LOCAL_STORAGE = "_eofol_translation_storage"

const defaultLang = TRANSLATION_DEFAULT_LANGUAGE

const translationStorage = loadLocalStorage(TRANSLATION_LOCAL_STORAGE) as TranslationStorage | undefined

let translation: Translation = {}

let langs = TRANSLATION_LANGUAGES.map((lang: string) => LANGS.find((langCodelist) => langCodelist.id === lang)).filter(
  Boolean,
)

let currentLang = defaultLang

let isCustomLang = currentLang && currentLang !== defaultLang

export const getTranslation = () => translation

const setTranslation = (content: Object) => {
  translation = content
}

export const getCustomLang = () => isCustomLang

const setIsCustomLang = () => {
  isCustomLang = currentLang !== defaultLang
}

const updateTranslation = () => {
  isBrowser() && isCustomLang
    ? fetchGeneral(`${BASE_URL}translation/${currentLang}.json`)
        .then((x) => setTranslation(x))
        .then(() => {
          forceRerender()
        })
    : forceRerender()
}

if (translationStorage && translationStorage.lang) {
  currentLang = translationStorage.lang
  setIsCustomLang()
  updateTranslation()
}

export const getLangs = () => langs

export const setCurrentLang = (lang: string) => {
  currentLang = lang
  setIsCustomLang()
  saveLocalStorage({ lang }, TRANSLATION_LOCAL_STORAGE)
  updateTranslation()
}

export const getCurrentLang = () => currentLang

if (TRANSLATION_ENABLED && isBrowser()) {
  const split = window.location.pathname.split("-")
  const langMutationExt = split[split.length - 1]
  const lang = langMutationExt.split(".")[0]
  if (langMutationExt !== "/" && lang !== "/" && langMutationExt && lang) {
    setCurrentLang(lang)
  }
}
