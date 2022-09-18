const net = require('net')
const fs = require('fs')
const crypto = require('crypto')

// cria instância do servidor
let server = net.createServer()

// ao encerrar o servidor
server.on('close', function () {
  console.log('Servidor encerrado!')
})

// ao conectar com um novo client
server.on('connection', function (socket) {
  console.log('Tamanho do buffer: ' + socket.bufferSize)

  console.log('---------detalhes do servidor -----------------')

  let address = server.address()
  let port = address.port
  let family = address.family
  let ipaddr = address.address
  console.log('Servidor utilizando a porta: ' + port)
  console.log('IP do servidor :' + ipaddr)
  console.log('Servidor é IP4/IP6 : ' + family)

  let lport = socket.localPort
  let laddr = socket.localAddress
  console.log('Servidor utilizando a porta local: ' + lport)
  console.log('IP local do servidor :' + laddr)

  console.log('------------detalhes do cliente remoto --------------')

  let rport = socket.remotePort
  let raddr = socket.remoteAddress
  let rfamily = socket.remoteFamily

  console.log('Socket remoto utilizando a porta: ' + rport)
  console.log('IP do socket remoto: ' + raddr)
  console.log('Socket remoto é IP4/IP6: ' + rfamily)

  console.log('--------------------------------------------')
  server.getConnections(function (error, count) {
    console.log('Número de conexões simultâneas no servidor: ' + count)
  })

  socket.setEncoding('utf8')

  socket.setTimeout(800000, function () {
    console.log('Socket timeout')
  })

  socket.on('data', function (data) {
    let bread = socket.bytesRead
    let bwrite = socket.bytesWritten
    console.log('Bytes lidos: ' + bread)
    console.log('Bytes escritos: ' + bwrite)

    // Gera hash do buffer recebido
    let hash = crypto
      .createHash('md5')
      .update(Uint8Array.from(data))
      .digest('hex')

    console.log(`Hash do arquivo recebido: ${hash}`)

    fs.writeFileSync('./serverReceiveData.txt', data, 'utf-8')

    let isBufferFull = socket.write('Data ::' + data)
    if (isBufferFull) {
      console.log('Flush de dados do buffer finalizado com sucesso')
    } else {
      socket.pause()
    }
  })

  // esvazia buffer
  socket.on('drain', function () {
    console.log('buffer de dados vazio')
    socket.resume()
  })

  socket.on('error', function (error) {
    console.log('Erro : ' + error)
  })

  socket.on('timeout', function () {
    console.log('Socket timeout')
    socket.end('Timed out!')
  })

  socket.on('end', function (data) {
    console.log('Socket encerrado')
    console.log('Dados : ' + data)
  })

  socket.on('close', function (error) {
    let bread = socket.bytesRead
    let bwrite = socket.bytesWritten
    console.log('Bytes lidos: ' + bread)
    console.log('Bytes escritos: ' + bwrite)
    console.log('Socket finalizado')
    if (error) {
      console.log('Socket foi finalizado por erro de transmissão')
    }
  })

  setTimeout(function () {
    let isdestroyed = socket.destroyed
    console.log('Socket finalizado:' + isdestroyed)
    socket.destroy()
  }, 1200000)
})

// quando há erros de transmissão
server.on('error', function (error) {
  console.log('Erro: ' + error)
})

// pronto para receber conexões
server.on('listening', function () {
  console.log('Servidor aguardando conexões')
})

server.maxConnections = 10

server.listen(8080)

setTimeout(function () {
  server.close()
}, 5000000)
