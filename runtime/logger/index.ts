const COMPILER_LOG_ERROR_MSG_PREFIX = "Eofol error: "

export const logError = (msg: string) => console.log(COMPILER_LOG_ERROR_MSG_PREFIX + msg)

export const logDefNotFound = (name: string) => logError(`Component definition not found for name = "${name}".`)

export const logTagHasNoName = (tag: string) =>
  logError(`Eofol component has no attribute "name" for tagname =  "${tag}".`)

export const logElementNotFound = (id: string) => logError(`DOM element with id = "${id}" does not exist.`)

export const logUnknownDomElement = (tag: string) => logError(`Unknown DOM element with type = "${tag}".`)

export const logDefAlreadyExists = (name: string) =>
  logError(`Cannot define component with name = "${name}" because a component with that name is already defined.`)

export const logDefHasNoName = () => logError("Custom component has no name.")
