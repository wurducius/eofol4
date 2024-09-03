import { defineStateful, Render } from "../defs"
import { div } from "../core"
import { fetchGeneral } from "../fetch"

export const dataContainer = (name: string, def: { render: Render; url: string }) => {
  return defineStateful(name, {
    render: (props) => {
      // @ts-ignore
      const data = props.state.data
      if (!data) {
        return div(undefined, "Skeleton")
      } else if (data === "LOADING") {
        return div(undefined, "Loading...")
      } else if (data === "ERROR") {
        return div(undefined, "Error")
      } else {
        return def.render(props)
      }
    },
    initialState: { data: undefined },
    // @ts-ignore
    effect: (props) => {
      const data = props.state.data
      if (!data) {
        fetchGeneral(def.url, undefined, "GET", undefined, true).then((res) => {
          props.setState({ ...props.state, data: res })
        })
      }
    },
  })
}
