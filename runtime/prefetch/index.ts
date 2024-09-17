import { getAssets, getConfig, getEnv } from "../internals"
import { relativizePath } from "../relativize-path"

const prefetchAsset = (asset: string) => {
  const path = relativizePath(asset)
  console.log(`Prefetch API -> Prefetching asset: ${path}`)
  return fetch(path)
}

const onCompletedPrefetching = () => {
  console.log("Prefetch API -> All assets fetched.")
}

const queuePrefetchViews = (views: string[], images: Record<string, string[]>, queue: string[]) => {
  views.forEach((asset) => {
    queue.push(asset)
    images[asset]?.forEach((image: string) => {
      queue.push(image)
    })
  })
}

const queuePrefetchAssets = (
  assets: { pages: string[]; images: Record<string, string[]>; other: string[] },
  PREFETCHING_STRATEGY: "all" | "link" | "none",
) => {
  const queue: string[] = []
  const { BASE_URL } = getEnv()
  if (PREFETCHING_STRATEGY === "link") {
    queuePrefetchViews(assets.pages, assets.images, queue)
  } else if (PREFETCHING_STRATEGY === "all") {
    queuePrefetchViews(
      getEnv().views.map((view) => `${BASE_URL}${view.path}`),
      assets.images,
      queue,
    )
  }
  assets.other.forEach((other: string) => {
    queue.push(other)
  })
  return queue
}

export const prefetchAssets = () => {
  const { PREFETCHING_STRATEGY } = getConfig()
  if (PREFETCHING_STRATEGY === "link" || PREFETCHING_STRATEGY === "all") {
    Promise.all(queuePrefetchAssets(getAssets(), PREFETCHING_STRATEGY).map(prefetchAsset)).then(onCompletedPrefetching)
  }
}
