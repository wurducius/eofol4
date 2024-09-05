import { isBrowser } from "../util"

const emptyInternals = {
  env: { views: [], BASE_URL: "./" },
  instances: {} as Record<string, any>,
  vdom: {},
  assets: { pages: [], scripts: [], images: [], other: [] },
}

type AssetList = { path: string; isStatic?: boolean }[]

// @TODO finish typing instances & vdom
type Internals = {
  env: { views: { path: string; isStatic?: boolean }[]; BASE_URL: string }
  instances: Record<string, any>
  vdom: any
  assets: { pages: AssetList; scripts: AssetList; images: AssetList; other: AssetList }
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
  const VIEWS = getAssets().pages
  const nextViewPath = getVIEWPath(viewName)
  const saved = VIEWS.find((VIEW) => VIEW.path === nextViewPath)
  if (!saved) {
    VIEWS.push({ path: nextViewPath, isStatic })
    console.log(getAssets())
  }
}
