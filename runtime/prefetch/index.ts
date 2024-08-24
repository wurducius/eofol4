import { getAssets } from "../internals"
import { isBrowser } from "../util"

// @TODO we are trying to fetch non-existing script bundles such as static.js for static view static.html
const prefetchAssets = () => {
  const assets = getAssets()
  const queue: string[] = []
  // @ts-ignore
  assets.pages.forEach((page: string) => {
    queue.push(page)
    const split = page.split("/")
    const scriptPath = `./assets/js/${split
      .map((part: string, i: number) => {
        if (i + 1 < split.length) {
          return part
        } else {
          const innerSplit = part.split(".")
          return innerSplit
            .map((innerPart: string, j: number) => (j + 1 < innerSplit.length ? innerPart : "js"))
            .join(".")
        }
      })
      .join("/")}`
    queue.push(scriptPath)
  })

  Promise.all(queue.map((asset) => fetch(asset).then(() => {}))).then(() => {
    console.log("Prefetch API -> All assets fetched.")
  })
}

if (isBrowser()) {
  window.onload = () => {
    prefetchAssets()
  }
}
