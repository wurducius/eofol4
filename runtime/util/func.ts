const _pipe = (f: Function, g: Function) => (arg: any) => g(f(arg))
export const pipe = (...fns: Function[]) => fns.reduce(_pipe)

export const id = (x: any) => x

// eslint-disable-next-line no-unused-vars
export function arrayCombinatorForEach<T>(handler: (t: T) => any) {
  return function (data: T | T[]) {
    if (Array.isArray(data)) {
      data.forEach(handler)
    } else {
      handler(data)
    }
  }
}
