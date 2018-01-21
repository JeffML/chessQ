import express from 'express';
const app = express();
import stockfish from 'stockfish'
const sf = stockfish();

const pm = (message) => {
  console.log("Posting:", message)
  sf.postMessage(message)
}

sf.onmessage = function(event) {
  console.log({event})
};

sf.postMessage("uci")

app.get('/', (req, res) => {
  // set an option
  pm('setoption name Hash value 32')
  pm('setoption name Contempt value 0')
  // pm('isready')
  pm('isready')
  // load game
  res.send("Hello World!")
})

app.listen(3000, () => console.log("server ready"))
