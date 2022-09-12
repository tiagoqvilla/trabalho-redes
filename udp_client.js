// -------------------- udp client ----------------
var udp = require('dgram')
var buffer = require('buffer')
const crypto = require('crypto')

// creating a client socket
var client = udp.createSocket('udp4')

//buffer msg
var data = Buffer.from('siddheshrane')

client.on('message', function (msg, info) {
  console.log('Data received from server : ' + msg.toString())
  console.log(
    'Received %d bytes from %s:%d\n',
    msg.length,
    info.address,
    info.port
  )
})

//sending msg
client.send(data, 2222, 'localhost', function (error) {
  if (error) {
    client.close()
  } else {
    // Gera hash do buffer recebido
    let hash = crypto
      .createHash('md5')
      .update(Uint8Array.from(data))
      .digest('hex')

    console.log(`Hash do arquivo recebido: ${hash}`)
    console.log('Data sent !!!')
  }
})

// var data1 = Buffer.from('hello')
// var data2 = Buffer.from('world')

// //sending multiple msg
// client.send([data1, data2], 2222, 'localhost', function (error) {
//   if (error) {
//     client.close()
//   } else {
//     console.log('Data sent !!!')
//   }
// })
