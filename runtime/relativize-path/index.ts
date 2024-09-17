import { getEnv } from "../internals"

const BASE_URL = getEnv().BASE_URL

// @ts-ignore
export const relativizePath = (path: string) => path.replaceAll("./", BASE_URL)
