export const capitalize = (str: string) =>
  str
    .split("")
    .map((letter: string, i: number) => (i === 0 ? letter.toUpperCase() : letter))
    .join("")

export const camelCaseToKebabCase = (attributeName: string) =>
  attributeName
    .split("")
    .reduce((acc, next) => acc + (next === next.toUpperCase() ? `-${next.toLowerCase()}` : next), "")
