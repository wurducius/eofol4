import { playEffect } from "./effect"
import { mount, rerender } from "./render"
import { StaticElement } from "../defs"
import { removeInstance } from "../instances"
import { shouldUpdate } from "./should-update"

// =========  (A) MOUNT    =========
//             A1 - Constructor
//             A2 - Get derived state from props
//             A3 - Render
//             A4 - Mounted

// eslint-disable-next-line no-unused-vars
export const onConstruct = (props) => {
  return {}
}

export const getDerivedStateFromProps = (props) => {
  return props.state
}

export const onComponentMount = (jsonElement: StaticElement) => {
  return mount(jsonElement)
}

export const onComponentMounted = (id: string) => {
  playEffect(id)
}

// =========  (B) UPDATE   =========
//             B1 - Get derived state from props
//             B2 - Should update
//             B3 - Render
//             B4 - Snapshot before update
//             B5 - Updated

export const onShouldUpdate = (id: string) => {
  return shouldUpdate(id)
}

export const onComponentUpdate = (id: string) => {
  return rerender(id)
}

export const onBeforeUpdate = () => {}

export const onComponentUpdated = (id: string) => {
  playEffect(id)
}

// =========  (C) UNMOUNT  =========
//             C1 - Will unmount
//             ?? - Unmounted

export const onComponentUnmount = (id: string) => {
  removeInstance(id)
}

export const onComponentUnmounted = () => {}
