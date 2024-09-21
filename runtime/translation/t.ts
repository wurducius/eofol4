import { getCurrentLang, getCustomLang, getTranslation } from "./translation"
import { Translation } from "./types"

const getTranslatedValueImpl = (translation: Translation, key: string[], defaultValue: string, fullKey: string) => {
  // @ts-ignore
  const nextValue = translation[key[0]]
  if (nextValue) {
    if (key.length === 1) {
      return nextValue
    } else {
      const nextKey = key.filter((k: string, i: number) => i > 0)
      return getTranslatedValueImpl(nextValue, nextKey, defaultValue, fullKey)
    }
  } else {
    console.log(`Translation API -> Translation not found for lang = ${getCurrentLang()} and key = ${fullKey}.`)
    return defaultValue
  }
}

const getTranslatedValue = (translation: Translation, key: string, defaultValue: string) => {
  const split = key.split(".")
  return getTranslatedValueImpl(translation, split, defaultValue, key)
}

export const t = (key: string, defaultValue: string) => {
  // @ts-ignore
  return getCustomLang() ? getTranslatedValue(getTranslation(), key, defaultValue) : defaultValue
}
