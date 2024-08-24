import { getAssets } from "../internals"
import { isBrowser } from "../util"

// @TODO do not prefetch current page assets because thats redundant
const prefetchAssets = () => {
  const assets = getAssets()
  const queue: string[] = []

  assets.pages.forEach((page: string) => {
    queue.push(page)
  })

  assets.scripts.forEach((script: string) => {
    const split = script.split("/")
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

  assets.images.forEach((image: string) => {
    queue.push(image)
  })

  assets.other.forEach((other: string) => {
    queue.push(other)
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
