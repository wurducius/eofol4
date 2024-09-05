import { isBrowser } from "../util"
import { VIEWType } from "../types"

const emptyInternals = {
  env: { views: [], BASE_URL: "./" },
  instances: {} as Record<string, any>,
  vdom: {},
  assets: { pages: [], images: [], other: [] },
}

// @TODO finish typing instances & vdom
type Internals = {
  env: { views: VIEWType[]; BASE_URL: string }
  instances: Record<string, any>
  vdom: any
  assets: { pages: string[]; images: string[]; other: string[] }
}

// @ts-ignore
// eslint-disable-next-line no-undef
export const getInternals = () => (isBrowser() ? (internals as Internals) : emptyInternals)

// @ts-ignore
export const getEnv = () => getInternals().env

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

export const pushAsset = (viewName: string, assetType: "pages" | "images" | "other") => {
  const list = getAssets()[assetType]
  if (!list.includes(viewName)) {
    list.push(viewName)
  }
}
