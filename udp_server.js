const udp = require('dgram')
const crypto = require('crypto')

// cria servidor UDP
let server = udp.createSocket('udp4')

// pronto pra receber conexões
server.on('listening', function () {
  let address = server.address()
  let port = address.port
  let family = address.family
  let ipaddr = address.address
  console.log('Servidor utilizando a porta: ' + port)
  console.log('IP do servidor :' + ipaddr)
  console.log('Servidor é IP4/IP6: ' + family)
})

// ao receber dados do client
server.on('message', function (msg, info) {
  // Gera hash do buffer recebido
  let hash = crypto.createHash('md5').update(Uint8Array.from(msg)).digest('hex')

  console.log(`Hash do arquivo recebido: ${hash}`)

  console.log('Dados recebidos do client: ' + msg.toString())
  console.log(
    'Recebidos %d bytes de %s:%d\n',
    msg.length,
    info.address,
    info.port
  )

  // envia ao client
  server.send(msg, info.port, 'localhost', function (error) {
    if (error) {
      client.close()
    } else {
      console.log('Dados enviados')
    }
  })
})

// quando há erros de transmissão
server.on('error', function (error) {
  console.log('Erro: ' + error)
  server.close()
})

// ao encerrar o socket
server.on('close', function () {
  console.log('Socket finalizado')
})

server.bind(2222)

setTimeout(function () {
  server.close()
}, 5000000)
