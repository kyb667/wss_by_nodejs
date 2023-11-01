const app = require("express")();
const http = require("http").createServer(app);
const WebSocket = require("ws");
const { StringDecoder } = require("string_decoder");

const wss = new WebSocket.Server({ server: http });

wss.broadcast = (message, location, myLocation) => {
  console.log("message : ", message);
  console.log("location : ", location);
  console.log("myLocation : ", myLocation);
  wss.clients.forEach((client) => {
    if ((client.location === location) & (client.myLocation !== myLocation)) {
      console.log("client location : ", client.location);
      console.log("client myLocation : ", client.myLocation);
      client.send(message);
    }
  });
};

wss.on("connection", function connection(ws, req) {
  // console.log(req.url);
  // console.log("location : ", req.url.split("/")[1]);
  // console.log("myLocation : ", req.url.split("/")[2]);

  // room name
  ws.location = req.url.split("/")[1];
  // user name
  ws.myLocation = req.url.split("/")[2];

  // ws.on("close", () => {
  //   wss.broadcast(`ユーザーが出ました。`, ws.location);
  // });

  // wss.clients.forEach((client) => {
  //   client.send(`${wss.clients.size}`);
  // });

  ws.on("message", function (msg) {
    console.log("received: %s", JSON.parse(msg));

    // ws.send(
    //   JSON.stringify({ from: JSON.parse(msg).to, msg: JSON.parse(msg).msg })
    // );

    // const decoder = new StringDecoder("utf8");
    // const buffer = new Buffer(msg);

    // let m = decoder.write(buffer) + "　もらいました！";
    // wss.broadcast(m, ws.location);
    wss.broadcast(
      JSON.stringify({ from: JSON.parse(msg).to, msg: JSON.parse(msg).msg }),
      ws.location,
      ws.myLocation
    );
  });

  // ws.send("つながりましたので、メッセージを送ってみてください！");
});
app.get("/", (req, res) => {
  res.send("<p>Connect to the websocket on port 8080</p>");
});

http.listen(8080, () => {
  console.log(`listening on ${http.address().address}:8080`);
});
