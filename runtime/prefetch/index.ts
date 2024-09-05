import { getAssets } from "../internals"

export const prefetchAssets = () => {
  const assets = getAssets()
  const queue: string[] = []

  assets.pages.forEach((asset) => {
    queue.push(asset)
  })

  assets.images.forEach((image: string) => {
    queue.push(image)
  })

  assets.other.forEach((other: string) => {
    queue.push(other)
  })

  Promise.all(queue.map((asset) => fetch(asset))).then(() => {
    console.log("Prefetch API -> All assets fetched.")
  })
}
