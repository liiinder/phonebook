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

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).send(`There is no entry with id #${id}`).end()
            }
        }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        }).catch(error => next(error))
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

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(person)
    })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    console.log('req', req)

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        }).catch(error => next(error))
})

app.get('/info', (req, res) => {

    Person.count().then(entries => {
        res.send(`
            <div>
            <p>Phonebook has info for ${entries} people</p>
            <p>${new Date()}</p>
            </div>
        `)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).sent({ error: 'malformated id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})