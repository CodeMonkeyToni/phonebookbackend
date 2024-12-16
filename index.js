const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
    const log = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
    ]
    const data = tokens.data(req, res)
    if (data !== "{}") {
        log.push(data)
    }
    return log.join(' ')
}))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    const responseText = 
        `Phonebook has info for ${persons.length} people 
        ${new Date().toString()}`
    response.send(responseText)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (!person) {
        return response.status(404).end()
    }
    response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const id = Math.floor(Math.random()*10000).toString()

    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: "content missing"
        })
    }

    if (persons.find(person => person.name === request.body.name))  {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const newPerson = {
        id: id,
        name: request.body.name,
        number: request.body.number
    }
    persons.push(newPerson)
    console.log(persons)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})