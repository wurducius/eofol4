import { hexToCSSFilter } from "hex-to-css-filter"

const injectElement = (id: string, content: string, condition: boolean) => {
  if (condition && id) {
    const scriptElement = document.getElementById(id)

    if (scriptElement) {
      scriptElement.innerHTML = content
    }
  }
}

// ===================================================================

injectElement("script", "Script injected and working!", true)
injectElement("module", "External dependency imported and working!", Boolean(hexToCSSFilter))
