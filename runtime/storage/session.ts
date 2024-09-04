import { clearGeneralStorage, deleteGeneralStorage, loadGeneralStorage, saveGeneralStorage } from "./general"
import { isBrowser } from "../util"

const DEFAULT_SESSION_STORAGE_NAME = "eofol-app-session-data"

const storage = isBrowser() ? sessionStorage : undefined

export const loadSessionStorage = loadGeneralStorage(storage, DEFAULT_SESSION_STORAGE_NAME)

export const saveSessionStorage = saveGeneralStorage(storage, DEFAULT_SESSION_STORAGE_NAME)

export const deleteSessionStorage = deleteGeneralStorage(storage, DEFAULT_SESSION_STORAGE_NAME)

export const clearSessionStorage = clearGeneralStorage(storage)
