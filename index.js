require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('phonebookEntry', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :phonebookEntry'))


// const Person = mongoose.model('Person', personSchema)


let persons = [
      {
        id: 1,
        name: "Arto Hellas",
        number: 040-123456
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: 39-44-5323523
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: 12-43-234345
      },
      {
        id: 4,
        name: "Mary Poppendieck",
        number: 39-23-6423122
      },
      {
        id: 5,
        name: "Mary",
        number: 39-23
      }
    ]


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}


const genId = () => {
  return Math.round(Math.random() * 10000)
}


// http://localhost:3001
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// http://localhost:3001/api/persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
  res.json(persons)
  })
})

// http://localhost:3001/api/persons/60a7b974b2cfc70cc84b5c28
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
     res.json(person)
    } else {
      res.status(404).end()
    }
  }) 
  .catch(error => next(error))
})

// http://localhost:3001/api/info
app.get('/api/info', (req, res) => {
    const date = new Date()
    const info =  `<div><p> Phonebook has info for ${persons.length} people </p>
    <p> ${date} </p></div>` 
    res.send(info)
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


// http://localhost:3001/api/persons
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  console.log(JSON.stringify(req.body));

  // if (!body.name) {
  //   return res.status(400).json({ 
  //     error: 'name is missing' 
  //   })
  // }
  // if ( persons.map(person => person.name.toLowerCase()).indexOf(person.name.toLowerCase()) !== -1 ) {
  //   return res.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }  
  // person.id = genId()
  // console.log(person);
  // res.json(person)

  const person = new Person({
    name: body.name,
    number: body.number,
  })
 
  person.save()
  .then(savedPerson => savedPerson.toJSON())
  .then(savedAndFormattedPerson => {
    res.json(savedAndFormattedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)