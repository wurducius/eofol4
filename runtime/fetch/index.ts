import { HttpMethod } from "../types"

type HeadersType = Record<string, string>

type Body = Object | string | undefined

const headersBase: HeadersType = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

const headersCors: HeadersType = {
  "Access-Control-Allow-Origin": "*",
}

const appendHeaders = (headersTarget: Headers, headersObj: HeadersType) => {
  Object.keys(headersObj).forEach((headerName) => {
    headersTarget.append(headerName, headersObj[headerName])
  })
}

export const fetchGeneral = (url: string, body?: Body, method?: HttpMethod, headers?: HeadersType, cors?: boolean) => {
  const bodyImpl = typeof body === "object" ? JSON.stringify(body) : body

  const headersImpl = new Headers()
  appendHeaders(headersImpl, headersBase)
  if (cors) {
    appendHeaders(headersImpl, headersCors)
  }
  if (headers) {
    appendHeaders(headersImpl, headers)
  }

  return fetch(url, {
    method: method ?? "GET",
    body: bodyImpl,
    headers: headersImpl,
    mode: cors ? "cors" : "no-cors",
  }).then((res) => {
    const contentType = res && res.headers && res.headers.get("content-type")
    return contentType && contentType.includes("application/json") ? res.json() : res
  })
}

export const get = (url: string) => fetchGeneral(url)

export const post = (url: string, body?: Object | string) => fetchGeneral(url, body, "POST")
