import { isBrowser } from "../util"

const emptyInternals = {
  env: { views: [], BASE_URL: "./" },
  instances: {} as Record<string, any>,
  vdom: {},
  assets: { pages: [], scripts: [], images: [], other: [] },
}

// @TODO finish typing instances & vdom
type Internals = {
  env: { views: { path: string; isStatic?: boolean }[]; BASE_URL: string }
  instances: Record<string, any>
  vdom: any
  assets: { pages: string[]; scripts: string[]; images: string[]; other: string[] }
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
