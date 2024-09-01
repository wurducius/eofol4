const _pipe = (f: Function, g: Function) => (arg: any) => g(f(arg))
export const pipe = (...fns: Function[]) => fns.reduce(_pipe)

export const id = (x: any) => x

const SLEEP_INTERVAL_MS = 100

export const sleepHandler = (handler: Function) => {
  setTimeout(() => {
    handler()
  }, SLEEP_INTERVAL_MS)
}

export const sleepPromise = () => new Promise((r) => setTimeout(r, SLEEP_INTERVAL_MS))
