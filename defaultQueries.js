export default `
# Welcome to chessQ

query createEngine {
  createEngine {
    engineId
    state
  }
}

query registerLater {
  registerLater(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751")
}

query register {
  register(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751", name: "JeffML", code: "mySecretCode")
}

fragment optionFields on Option {
  ... on SpinOption {
    spinValue: value
    min
    max
  }
  ... on CheckOption {
    checkValue: value
  }
  ... on ComboOption {
    comboValue: value
    options
  }
}

query uci {
  uci(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751") {
    identity {
      name
      author
    }
    options {
      __typename
      name
      type
      ...optionFields
    }
    uciokay
  }
}

query setOptions {
  setComboOption(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751", name: "Foo", value: "Flum")
  setSpinOption(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751", name: "Flum", value: 42)
  setButtonOption(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751", name: "Flim")
  setCheckOption(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751", name: "Fazzle", value: false)
}

query quit{quit(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751")}
`
