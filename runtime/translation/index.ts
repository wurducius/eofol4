import { getEnv } from "../internals"
import { isBrowser } from "../util"
import { forceRerender } from "../stateful"
import { fetchGeneral } from "../fetch"

const env = getEnv()
const BASE_URL = env.BASE_URL
const config = env.config
const TRANSLATION_ENABLED = config.TRANSLATION_ENABLED
// const TRANSLATION_DEFAULT_LANGUAGE = config.TRANSLATION_DEFAULT_LANGUAGE
const TRANSLATION_DEFAULT_LANGUAGE = "en"

const defaultLang = TRANSLATION_DEFAULT_LANGUAGE

let currentLang = "en"

let translation = {}

const setTranslation = (content: Object) => {
  translation = content
}

const updateTranslation = () => {
  isBrowser() &&
    fetchGeneral(`${BASE_URL}translation/${currentLang}.json`)
      .then((x) => setTranslation(x))
      .then(() => {
        forceRerender()
      })
}

export const setCurrentLang = (lang: string) => {
  currentLang = lang
  updateTranslation()
}

if (isBrowser()) {
  const split = window.location.pathname.split("-")
  const langMutationExt = split[split.length - 1]
  const lang = langMutationExt.split(".")[0]
  setCurrentLang(langMutationExt !== "/" && lang !== "/" ? lang : defaultLang)
}

if (TRANSLATION_ENABLED) {
  updateTranslation()
}

export const t = (key: string, defaultValue: string) => {
  // @ts-ignore
  return currentLang !== defaultLang ? translation[key] : defaultValue
}
