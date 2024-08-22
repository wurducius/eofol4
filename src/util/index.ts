import { isBrowser } from "../../runtime"

export const injectElement = (id: string, content: string, condition?: boolean) => {
  if ((condition === undefined || condition) && id) {
    const scriptElement = document.getElementById(id)

    if (scriptElement) {
      scriptElement.innerHTML = content
    }
  }
}

export const getPageName = () => (isBrowser() ? window.location.pathname.replace("/", "") : "unknown")

export const capitalize = (str: string) =>
  str
    .split("")
    .map((letter: string, i: number) => (i === 0 ? letter.toUpperCase() : letter))
    .join("")
