require('dotenv').config()

// You can change the database type to another,
// check this for detail: https://typeorm.io/#/connection-options
const database = {
  name: 'default',
  type: 'mysql',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'test',
  synchronize: process.env.DB_SYNCHRONIZE || true,
  logging: process.env.DB_LOGGING || false
}

// A MySQL client on Unix can connect to the mysqld server in two different ways: 
// By using a Unix socket file to connect through a file in the file system (default /tmp/mysql.sock), 
// or by using TCP/IP, which connects through a port number. 
// 
// A Unix socket file connection is faster than TCP/IP, 
// but can be used only when connecting to a server on the same computer. A Unix socket file is used if you do not 
// specify a host name or if you specify the special host name localhost.
// 
// check this: https://dev.mysql.com/doc/refman/8.0/en/can-not-connect-to-server.html
if (process.env.SOCKETPATH) database.extra = { socketPath: process.env.SOCKETPATH }
else database.host = process.env.DB_HOST || 'localhost'

module.exports = {
  app: { port: Number(process.env.APP_PORT) || 8080 },
  database
}
