import type {Redis} from 'ioredis';
const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const http = require("http").Server(app)
const io = require("socket.io")(http)
const IoRedis = require('ioredis');
const redis_address = process.env.REDIS_ADDRESS || 'redis://chaut-cluster.galiun.ng.0001.apne1.cache.amazonaws.com';
const redis:Redis = new IoRedis(redis_address);

app.get("/", (req: any, res: any) => {
  res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket: any) => {
  socket.on("chat message", async (msg: { userName: string; comment: string }) => {
    if (msg.userName === "") {
      msg.userName = "No Name"
    }
    redis.xadd('chaut', '*','message', 'hogehogehooge')
    const respons = await redis.xread('COUNT', 100, 'BLOCK', '5000', 'STREAMS', 'chaut', '$')
    console.log(respons)
    // const result = redis.get('hoge')
    // result.then((res: any) => {
    //   console.log('redus_result: ',res)
    // })
    io.emit("chat message", msg)
  })
})

http.listen(port, () => console.log(`Example app listening on port ${port}!`))
