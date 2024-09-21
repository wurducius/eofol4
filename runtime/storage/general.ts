const getGeneralStorageName = (defaultGeneralStorageName: string, generalStorageName?: string) =>
  generalStorageName ?? defaultGeneralStorageName

export const loadGeneralStorage =
  (storage: any, defaultStorageName: string) =>
  (storageName?: string): Object | undefined => {
    if (storage) {
      const data = storage.getItem(getGeneralStorageName(defaultStorageName, storageName))
      if (data) {
        let json
        try {
          json = JSON.parse(data)
          return json
          // eslint-disable-next-line no-unused-vars
        } catch (ex) {
          return undefined
        }
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }

export const saveGeneralStorage =
  (storage: any, defaultStorageName: string) => (nextState: Object, storageName?: string) => {
    if (storage) {
      storage.setItem(getGeneralStorageName(defaultStorageName, storageName), JSON.stringify(nextState))
    } else {
      return undefined
    }
  }

export const deleteGeneralStorage = (storage: any, defaultStorageName: string) => (storageName?: string) => {
  if (storage) {
    storage.removeItem(getGeneralStorageName(defaultStorageName, storageName))
  } else {
    return undefined
  }
}

export const clearGeneralStorage = (storage: any) => () => {
  if (storage) {
    storage.clear()
  } else {
    return undefined
  }
}
