export const downloadFile = (url: string) => {
  const a = document.createElement("a")
  a.href = url
  const downloadNName = url.split("/").pop()
  if (downloadNName) {
    a.download = downloadNName
  }
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
