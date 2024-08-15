export const injectElement = (id: string, content: string, condition?: boolean) => {
  if ((condition === undefined || condition) && id) {
    const scriptElement = document.getElementById(id)

    if (scriptElement) {
      scriptElement.innerHTML = content
    }
  }
}

export const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined"

export const getPageName = () => (isBrowser() ? window.location.pathname.replace("/", "") : "unknown")
