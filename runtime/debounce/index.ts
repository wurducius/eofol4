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

export const throttle = (callback: Function, delay: number) => {
  let timerFlag: NodeJS.Timeout | undefined = undefined
  return (...args: any) => {
    if (timerFlag === undefined) {
      callback(...args)
      timerFlag = setTimeout(() => {
        timerFlag = undefined
      }, delay)
    }
  }
}
