export const appendChild = (target, child) => {
  if (child) {
    if (typeof child === "string") {
      target.insertAdjacentHTML("beforeend", child)
    } else {
      target.appendChild(child)
    }
  }
}

export const domClearChildren = (domElement) => {
  const childrenToDelete = []
  for (let i = 0; i < domElement.childNodes.length; i++) {
    childrenToDelete.push(domElement.childNodes.item(i))
  }
  childrenToDelete.forEach((childToDelete) => {
    if (childToDelete) {
      domElement.removeChild(childToDelete)
    }
  })
}

export const domAppendChildren = (children, target) => {
  children.forEach((child) => {
    appendChild(target, child)
  })
}
