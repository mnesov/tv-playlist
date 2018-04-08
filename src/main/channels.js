import {net} from 'electron'

export const getChannels = (sourceUrl, callback) => {
  let data = ''
  const request = net.request(sourceUrl)
  request.on('response', response => {
    response.on('data', chunk => {
      data += chunk
    })
    response.on('end', () => {
      callback(data)
    })
  })
  request.end()
}
