const PORT = 3004;

// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

server.use(router)
server.listen(PORT, () => {
  console.log(`🤖  JSON Server is running - http://localhost:${PORT}`)
})
