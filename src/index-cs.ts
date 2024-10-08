import { injectElement, randomString } from "./util"
import {
  button,
  createEofolElement,
  createProjection,
  createSelector,
  createStore,
  dataContainer,
  defineFlat,
  defineStateful,
  defineVirtual,
  div,
  forceRerender,
  getBreakpoint,
  getBreakpointView,
  image,
  isBrowser,
  link,
  selector,
  setStore,
  span,
  State,
  sx,
  sy,
  getTheme,
  createSlice,
  dispatch,
  h3,
  input,
  select,
  option,
  h2,
  label,
  addTheme,
  setTheme,
  t,
} from "../runtime"

addTheme("second", {
  mode: "dark",
  color: {},
  typography: {},
  spacing: {},
  size: {},
  borderRadius: {},
  zIndex: {},
  config: {},
})
setTheme("second")

injectElement("script", "Script injected and working!", true)
if (isBrowser()) {
  document.getElementById("sx")?.setAttribute("class", sx({ color: "fuchsia" }))
  document.getElementById("sy")?.setAttribute("class", sy("sy-classname-test", { color: "lightgreen" }))
}

injectElement("breakpoint", `Breakpoint: ${getBreakpoint()}`, true)

const breakpointStyle = sx({ color: "peachpuff" })

export const firstcs = defineStateful("firstcs", {
  classname: sx({ color: "fuchsia" }),
  // @ts-ignore
  render: (props) => {
    injectElement("breakpoint", `Breakpoint: ${getBreakpoint()}`, true)
    // @ts-ignore
    return [
      getBreakpointView({
        xs: () => div(breakpointStyle, "xs"),
        sm: () => div(breakpointStyle, "sm"),
        md: () => div(breakpointStyle, "md"),
        lg: () => div(breakpointStyle, "lg"),
        xl: () => div(breakpointStyle, "xl"),
        xxl: () => div(breakpointStyle, "xxl"),
      }),
      div(sx({ color: "red" }), ["Eofol compiled!!!", `Attribute eofolAttribute = ${props.attributes.eofolattribute}`]),
      "Output array !!!",
      randomString(),
      "Translation: ",
      t("example", "Example"),
      ...(Array.isArray(props.children) ? props.children : [props.children]),
    ].filter(Boolean)
  },
  effect: [
    () => {
      console.log("Array effect!")
      return () => {
        console.log("Effect cleanup!")
      }
    },
  ],
})

export const firstxcs = defineStateful("firstxcs", {
  // @ts-ignore
  render: (props) =>
    div(sx({ color: "red" }), [
      "Dynamically rendered and mounted stateful component working!",
      `Dynamic attribute = ${props.attributes.dynamicAttribute}`,
    ]),
})

export const firstxxcs = defineStateful("firstxxcs", {
  // @ts-ignore
  render: (props) => ["Firstxx", ...(Array.isArray(props.children) ? props.children : [props.children])],
})

export const secondcs = defineStateful("secondcs", {
  render: (props) =>
    // @ts-ignore
    props.state?.onStateChange
      ? div(sx({ color: "green" }), [
          "Stateful component state and effect working!",
          createEofolElement("firstxcs", undefined, undefined, { dynamicAttribute: "Working!" }),
          createEofolElement("firstxxcs", undefined, ["Nested child"]),
          createEofolElement("thirdcs"),
        ])
      : div(sx({ color: "blue" }), ["Stateful component state and effect not working."]),
  initialState: { onStateChange: false },
  // @ts-ignore
  effect: (props) => {
    const { state, setState } = props
    if (!state.onStateChange) {
      setState({ ...state, onStateChange: true })
    }
  },
})

const onForceRerender = () => {
  console.log("Force rerender")
  forceRerender()
}

export const fourthcs = defineFlat("fourthcs", { render: () => div(undefined, "Flat example") })

export const hookcs = defineVirtual("hookcs", {
  effect: () => {
    console.log("Hook example!")
  },
})

export const fragmentcs = defineVirtual("fragmentcs", {
  // @ts-ignore
  render: () => "Fragment example",
})

export const thirdcs = defineStateful("thirdcs", {
  render: () => [
    button(
      undefined,
      "Force rerender",
      {},
      {
        onclick: onForceRerender,
      },
    ),
    createEofolElement("fourthcs"),
    createEofolElement("hookcs"),
    createEofolElement("fragmentcs"),
  ],
})

export const weathercs = dataContainer("weathercs", {
  // @ts-ignore
  render: (props) => div(undefined, `Latitude = ${props.state?.data.latitude}°`),
  url: "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m",
})

const STORE1 = "store1cs"
const STORE2 = "store2cs"
createStore(STORE1, { data: "Store state not changed." })
createProjection(STORE2, STORE1, (state) => ({ data: state.data }))
const selector2 = createSelector(STORE1, (state: State) => ({ data: state.data }))

export const subscribedcs = defineStateful("subscribedcs", {
  render: () => {
    const stored = selector(STORE1)
    return div(undefined, `Subscribed${stored.data ? ` -> ${stored.data}` : ""}`)
  },
  subscribe: STORE1,
})

export const projectioncs = defineStateful("projectioncs", {
  render: () => {
    const stored = selector(STORE2)
    return div(undefined, `Projection${stored.data ? ` -> ${stored.data}` : ""}`)
  },
  subscribe: STORE2,
})

export const createdSelectorcs = defineStateful("createdSelectorcs", {
  render: () => {
    const stored = selector2.selector()
    return div(undefined, `Projection${stored.data ? ` -> ${stored.data}` : ""}`)
  },
  subscribe: selector2.id,
})

const onSetStore = () => {
  console.log("Set store!")
  setStore(STORE1, { data: "Store state changed!" })
}

// @TODO bind onclick handler at compile time OR rehydrate
export const storeSettercs = defineStateful("storeSettercs", {
  render: () => button(undefined, "Set store", {}, { onclick: isBrowser() && onSetStore }),
})

export const examplecs = defineStateful("examplecs", {
  render: () => {
    const theme = getTheme()
    return div(sx({ display: "flex", flexDirection: "column", alignItems: "center" }), [
      image({
        src: "phi.svg",
        alt: "Test Image API",
        height: 100,
        width: 100,
        classname: sx({ backgroundColor: "green" }),
      }),
      span(
        sx({
          color: theme.color.secondary.base,
        }),
        "Theme color example",
      ),
    ])
  },
})

export const linkscs = defineStateful("linkscs", {
  render: () =>
    div("col container", [
      link({ href: "./index2.html", content: "Second page" }),
      link({ href: "./level/second/index.html", content: "Second level page" }),
      link({ href: "./map.html", content: "Map" }),
      link({ href: "./generated.html", content: "Generated page" }),
      link({ href: "./docs.html", content: "Eofol4 docs" }),
    ]),
})

const Counter = "store3cs"
const CounterAction = {
  increment: "increment",
  reset: "reset",
}

createSlice(Counter, {
  state: { data: 0 },
  actions: {
    [CounterAction.increment]: (state) => ({ data: state.data + 1 }),
    [CounterAction.reset]: () => ({ data: 0 }),
  },
  middleware: {
    logger: {
      before: (props) => {
        console.log(`Slice API -> Counter before action: ${props.state.data}`)
        return props
      },
      after: (props) => {
        console.log(`Slice API -> Counter after action: ${props.state.data}`)
        return props
      },
    },
  },
})

const handleIncrement = () => {
  dispatch(Counter)(CounterAction.increment)
}

const handleReset = () => {
  dispatch(Counter)(CounterAction.reset)
}

export const countercs = defineStateful("countercs", {
  render: () =>
    div("col", [
      h2(undefined, "Slice API"),
      h3(undefined, `Count = ${selector(Counter).data}`),
      div("row", [
        button(undefined, "+", undefined, {
          onclick: isBrowser() && handleIncrement,
        }),
        button(undefined, "Reset", undefined, {
          onclick: isBrowser() && handleReset,
        }),
      ]),
    ]),
  subscribe: Counter,
})

const FormExample = "store4cs"
createStore(FormExample, { value: "" })

const onChange =
  isBrowser() &&
  ((event) => {
    const value = event.target.value
    console.log(`Input.onChange -> ${value}`)
    setStore(FormExample, { value: value })
  })

export const inputExamplecs = defineStateful("inputExamplecs", {
  render: () => {
    const value = selector(FormExample).value
    const id = "Controlled input example"
    return div(
      ["col", sx({ alignItems: "center" })],
      [
        div(sx({ width: "256px" }), [
          label(undefined, id, { for: id }),
          input(sx({ width: "100%" }), undefined, { value, id }, { onchange: onChange }),
        ]),
      ],
    )
  },
  subscribe: FormExample,
})

const FormExampleSelect = "store5cs"
createStore(FormExampleSelect, { value: "" })

const onChangeSelect =
  isBrowser() &&
  ((event) => {
    const value = event.target.value
    console.log(`Select.onChange -> ${value}`)
    setStore(FormExampleSelect, { value: value })
  })

export const selectExamplecs = defineStateful("selectExamplecs", {
  render: () => {
    const value = selector(FormExampleSelect).value
    const id = "Controlled select example"
    return div(
      ["col", sx({ alignItems: "center" })],
      [
        div(sx({ width: "256px" }), [
          label(undefined, id, { for: id }),
          select(
            sx({ width: "100%" }),
            [
              option(undefined, "First", { value: "1" }),
              option(undefined, "Second", { value: "2" }),
              option(undefined, "Third", { value: "3" }),
            ],
            { value, id },
            { onchange: onChangeSelect },
          ),
        ]),
      ],
    )
  },
  subscribe: FormExample,
})
