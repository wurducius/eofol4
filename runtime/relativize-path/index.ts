import { getEnv } from "../internals"

const BASE_URL = getEnv().BASE_URL

export const relativizePath = (path: string) => path.replace("./", BASE_URL)
