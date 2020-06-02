import express from 'express'

const app = express()

app.get('/users', (req, resp) => {
  resp.json({ data: 'Hello World' })
})

app.listen(3000, () => {
  console.log('Listen port 3000')
})
