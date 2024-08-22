const _pipe = (f: Function, g: Function) => (arg: any) => g(f(arg))
export const pipe = (...fns: Function[]) => fns.reduce(_pipe)

export const id = (x: any) => x
