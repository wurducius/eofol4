import { getAssets } from "../internals"

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
      console.log(`Prefetch API -> Prefetching asset: ${asset}`)
      return fetch(asset)
    }),
  ).then(() => {
    console.log("Prefetch API -> All assets fetched.")
  })
}
