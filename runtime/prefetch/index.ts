import { getAssets } from "../internals"

// @TODO do not prefetch current page assets because thats redundant
export const prefetchAssets = () => {
  const assets = getAssets()
  const queue: string[] = []

  assets.pages.forEach((asset) => {
    console.log(asset)
    queue.push(asset)
  })

  // @TODO probably remove scripts attribute?

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
