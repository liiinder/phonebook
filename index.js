require('dotenv').config()
const { application } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) { 
    return [
        JSON.stringify(req.body)
    ] 
})
app.use(morgan('tiny'))
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    res.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>
    `)
})

// app.get('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     const person = persons.find(p => p.id === id)
//     if (person) {
//         res.json(person)
//     } else {
//         res.status(404).send(`There is no entry with id #${id}`).end()
//     }
// })

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.number) {
        return res.status(400).json({
            error: 'Phonenumber is missing'
        })
    } else if (!body.name) {
        return res.status(400).json({
            error: 'Name is missing'
        })
    } 
    // else if (persons.find(person => person.name === body.name)) {
    //     return res.status(400).json({
    //         error: 'Name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(person)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})