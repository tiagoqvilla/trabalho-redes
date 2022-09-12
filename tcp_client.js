//---------------------client----------------------
var net = require('net')
const fs = require('fs')
const crypto = require('crypto')

// creating a custom socket client and connecting it....
var client = new net.Socket()
client.connect({
  port: 8080,
})

client.on('connect', async function () {
  console.log('Client: connection established with server')

  console.log('---------client details -----------------')
  var address = client.address()
  var port = address.port
  var family = address.family
  var ipaddr = address.address
  console.log('Client is listening at port' + port)
  console.log('Client ip :' + ipaddr)
  console.log('Client is IP4/IP6 : ' + family)

  // const filePath = path.join(folderpath, filename);

  // let fileContent = await fs.readFile(filePath);
  // writing data to server
  const fileTeste = await fs.readFileSync('./testegrande.txt')
  // console.log(fileTeste);
  const message = new Buffer.from(fileTeste)

  // Gera hash do buffer enviado
  let hash = crypto
    .createHash('md5')
    .update(Uint8Array.from(fileTeste))
    .digest('hex')
  console.log(`Hash do arquivo enviado: ${hash}`)

  client.write(message)
  // client.write('hello from client')
})

client.setEncoding('utf8')

client.on('data', function (data) {
  console.log('Data from server:' + data)
})

// setTimeout(function () {
//   client.end('Bye bye server')
// }, 50000)

//NOTE:--> all the events of the socket are applicable here..in client...

// -----------------creating client using net.connect instead of custom socket-------

// server creation using net.connect --->
// u can also => write the below code in seperate js file
// open new node instance => and run it...

// const clients = net.connect({ port: 8080 }, () => {
//   // 'connect' listener
//   console.log('connected to server!')
//   clients.write('world!\r\n')
// })
// clients.on('data', (data) => {
//   console.log(data.toString())
//   clients.end()
// })
// clients.on('end', () => {
//   console.log('disconnected from server')
// })
