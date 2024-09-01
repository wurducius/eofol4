export const domAttributesToJson = (domAttributes) => {
  const attributes = {}
  for (let i = 0; i < domAttributes.length; i++) {
    const att = domAttributes.item(i)
    if (att && att.value) {
      attributes[att.name] = att.value
    }
  }
  return attributes
}
