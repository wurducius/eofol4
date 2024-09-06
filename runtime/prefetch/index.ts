import { getAssets } from "../internals"
import { relativizePath } from "../relativize-path"

export const prefetchAssets = () => {
  const assets = getAssets()
  const queue: string[] = []

  assets.pages.forEach((asset) => {
    queue.push(asset)
    const images = assets.images[asset]
    images?.forEach((image: string) => {
      queue.push(image)
    })
  })

  assets.other.forEach((other: string) => {
    queue.push(other)
  })

  Promise.all(
    queue.map((asset) => {
      const path = relativizePath(asset)
      console.log(`Prefetch API -> Prefetching asset: ${path}`)
      return fetch(path)
    }),
  ).then(() => {
    console.log("Prefetch API -> All assets fetched.")
  })
}
