import { isBrowser } from "../util"

const emptyInternals = { env: {}, instances: {}, vdom: {}, assets: { pages: [], scripts: [], images: [], other: [] } }

// @ts-ignore
// eslint-disable-next-line no-undef
export const getInternals = () => (isBrowser() ? internals : emptyInternals)

// @ts-ignore
export const getEnv = () => getInternals().env

// @ts-ignore
export const getInstances = () => getInternals().instances

// @ts-ignore
export const getVDOM = () => getInternals().vdom

// @ts-ignore
export const getAssets = () => getInternals().assets
