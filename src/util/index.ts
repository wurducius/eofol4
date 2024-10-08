import { isBrowser } from "../../runtime"

export const injectElement = (id: string, content: string, condition?: boolean) => {
  if ((condition === undefined || condition) && id && isBrowser()) {
    const scriptElement = document.getElementById(id)
    if (scriptElement) {
      scriptElement.innerHTML = content
    }
  }
}

export const getPageName = () => (isBrowser() ? window.location.pathname.replace("/", "") : "unknown")

export const randomString = () => (Math.random() + 1).toString(36).substring(7)
