export const debounce = (function () {
  let timers: Record<string, number> = {}

  return function (callback: Function, delay: number, id: string) {
    delay = delay || 500
    id = id || "duplicated event"

    if (timers[id]) {
      clearTimeout(timers[id])
    }

    timers[id] = setTimeout(callback, delay)
  }
})()
