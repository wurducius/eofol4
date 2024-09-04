import { clearGeneralStorage, deleteGeneralStorage, loadGeneralStorage, saveGeneralStorage } from "./general"
import { isBrowser } from "../util"

const DEFAULT_LOCAL_STORAGE_NAME = "eofol-app-data"

const storage = isBrowser() ? localStorage : undefined

export const loadLocalStorage = loadGeneralStorage(storage, DEFAULT_LOCAL_STORAGE_NAME)

export const saveLocalStorage = saveGeneralStorage(storage, DEFAULT_LOCAL_STORAGE_NAME)

export const deleteLocalStorage = deleteGeneralStorage(storage, DEFAULT_LOCAL_STORAGE_NAME)

export const clearLocalStorage = clearGeneralStorage(storage)
