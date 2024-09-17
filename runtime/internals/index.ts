import { isBrowser } from "../util"
import { VIEWType } from "../types"

const emptyInternals = {
  env: { views: [], BASE_URL: "/", config: {} as Record<string, any> },
  instances: {} as Record<string, any>,
  vdom: {},
  assets: { pages: [], images: {} as Record<string, string[]>, other: [] },
}

// @TODO finish typing instances & vdom
type Internals = {
  env: { views: VIEWType[]; BASE_URL: string; config: Record<string, any> }
  instances: Record<string, any>
  vdom: any
  assets: { pages: string[]; images: Record<string, string[]>; other: string[] }
}

// @ts-ignore
// eslint-disable-next-line no-undef
export const getInternals = () => (isBrowser() ? (internals as Internals) : emptyInternals)

// @ts-ignore
export const getEnv = () => getInternals().env

export const getConfig = () => getInternals().env.config.env

// @ts-ignore
export const getInstances = () => getInternals().instances

// @ts-ignore
export const getVDOM = () => getInternals().vdom

// @ts-ignore
export const getAssets = () => getInternals().assets

// @ts-ignore
const getVIEWPath = (path: string) => path.replaceAll("\\", "/")

export const pushVIEW = (viewName: string, isStatic?: boolean) => {
  const VIEWS = getEnv().views
  const nextViewPath = getVIEWPath(viewName)
  const saved = VIEWS.find((VIEW) => VIEW.path === nextViewPath)
  if (!saved) {
    VIEWS.push({ path: nextViewPath, isStatic })
  }
}

export const pushAsset = (assetName: string, assetType: "pages" | "images" | "other") => {
  if (assetType === "images") {
    const list = getAssets().images
    const currentView = getCURRENT_VIEW()
    if (!list[currentView]) {
      list[currentView] = []
    }
    const images = list[currentView]
    if (!images.includes(assetName)) {
      images.push(assetName)
    }
  } else {
    const list = getAssets()[assetType]
    if (!list.includes(assetName)) {
      list.push(assetName)
    }
  }
}

export let CURRENT_VIEW: string = ""

export const getCURRENT_VIEW = () => CURRENT_VIEW

export const setCURRENT_VIEW = (currentView: string) => {
  CURRENT_VIEW = currentView
}

export const setBASE_URL = (baseUrl: string) => {
  const env = getEnv()
  env.BASE_URL = baseUrl
}
