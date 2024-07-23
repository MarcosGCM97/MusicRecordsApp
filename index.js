const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
//const mongoose = require('mongoose')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny'))

let albums = [
    {
        "title": "El otro yo",
        "artist": "MarCongre",
        "likes": 0,
        "id": 1
    }
]
  
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/albums', (request, response) => {
    response.json(albums)
})

app.get('/api/albums/:id', (request, response) => {
    const id = Number(request.params.id)
    const album = albums.find(album => album.id === id)
    
    if(!album){
        response.status(404).end()
    } 
    response.json(album)
})

app.delete('/api/albums/:id', (request, response) => {
    const id = Number(request.params.id)
    albums = albums.filter(album => album !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = albums.length > 0 
    ? Math.max(...albums.map(a => a.id))
    : 0

    return maxId + 1    
}
app.post('/api/albums', (request, response) => {
    const body = request.body
    
    if(!body.artist){
        return response.status(400).json({
            error: 'artist missing'
        })
    }
    album = {
        title: body.title,
        artist: body.artist,
        likes: body.likes,
        id: generateId()
    }
    albums = albums.concat(album)
    
    response.json(albums)
})

app.use(requestLogger)
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)