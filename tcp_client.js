//---------------------client----------------------
const net = require('net')
const fs = require('fs')
const crypto = require('crypto')

// cria socket do client
let client = new net.Socket()
client.connect({
  port: 8080,
})

client.on('connect', async function () {
  console.log('Conexão estabelecida com o servidor')

  console.log('---------detalhes do client -----------------')
  let address = client.address()
  let port = address.port
  let family = address.family
  let ipaddr = address.address
  console.log('Client utilizando a porta: ' + port)
  console.log('IP do client: ' + ipaddr)
  console.log('Client é IP4/IP6: ' + family)

  // escreve dados no servidor
  const fileTeste = await fs.readFileSync('./testegrande.txt')
  // const fileTeste = await fs.readFileSync('./teste.txt')

  const message = new Buffer.from(fileTeste)

  // Gera hash do buffer enviado
  let hash = crypto
    .createHash('md5')
    .update(Uint8Array.from(message))
    .digest('hex')
  console.log(`Hash do arquivo enviado: ${hash}`)

  client.write(message)
})

client.setEncoding('utf8')

client.on('data', function (data) {
  let bread = client.bytesRead
  console.log(`Bytes lidos: ${bread}`)
})
