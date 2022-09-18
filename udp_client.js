// -------------------- udp client ----------------
const udp = require('dgram')
const fs = require('fs')
const crypto = require('crypto')

// cria socket do client
let client = udp.createSocket('udp4')

// ao receber mensagem do servidor
client.on('message', function (msg, info) {
  console.log('Dados recebidos do servidor: ' + msg.toString())
  console.log(
    'Recebidos %d bytes de %s:%d\n',
    msg.length,
    info.address,
    info.port
  )
})

// envio de dados

// const fileTeste = fs.readFileSync('./teste_10000bytes.txt')
const fileTeste = fs.readFileSync('./teste_1500bytes.txt')
let data = new Buffer.from(fileTeste)

client.send(data, 8080, 'localhost', function (error) {
  if (error) {
    client.close()
  } else {
    // Gera hash do buffer enviado
    let hash = crypto
      .createHash('md5')
      .update(Uint8Array.from(data))
      .digest('hex')

    console.log(`Hash do arquivo enviado: ${hash}`)
    console.log('Dados enviados')
  }
})
