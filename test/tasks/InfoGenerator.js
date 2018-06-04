export default function* () {
  yield* infoArray
};

const infoArray = [
  {
    __typename: "Depth",
    depth: 1,
    seldepth: 0
  }, {
    __typename: "Score",
    cp: 13,
    depth: 1,
    nodes: 13,
    time: 15,
    pv: ["f1b5"]
  }, {
    __typename: "Depth",
    depth: 2,
    seldepth: 2
  }, {
    __typename: "Nps",
    value: 15937
  }, {
    __typename: "Score",
    cp: 14,
    depth: 2,
    nodes: 255,
    time: 15,
    pv: ["f1c4", "f8c5"]
  }, {
    __typename: "Depth",
    depth: 2,
    seldepth: 7,
    nodes: 255
  }, {
    __typename: "Depth",
    depth: 3,
    seldepth: 7
  }, {
    __typename: "Nps",
    value: 26437
  }, {
    __typename: "Score",
    cp: 20,
    depth: 3,
    nodes: 423,
    time: 15,
    pv: ["f1c4", "g8f6", "b1c3"]
  }, {
    __typename: "Nps",
    value: 41562
  }, {
    __typename: "BestMove",
    value: "g1f3",
    ponder: "d8f6"
  }
]
