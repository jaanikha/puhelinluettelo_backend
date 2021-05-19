const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
morgan.token('phonebookEntry', function (req, res) { return JSON.stringify(req.body) })
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :phonebookEntry'))


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


const genId = () => {
  return Math.round(Math.random() * 10000)
}


// http://localhost:3001
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

// http://localhost:3001/api/persons
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// http://localhost:3001/api/persons/4
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// http://localhost:3001/info
app.get('/info', (req, res) => {
    const date = new Date()
    const info =  `<div><p> Phonebook has info for ${persons.length} people </p>
    <p> ${date} </p></div>` 
    res.send(info)
})


app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})


// http://localhost:3001/api/persons
app.post('/api/persons', (req, res) => {
  const person = req.body

  console.log(JSON.stringify(req.body));

  if (!person.name) {
    return res.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if ( persons.map(person => person.name.toLowerCase()).indexOf(person.name.toLowerCase()) !== -1 ) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }  

  person.id = genId()
  console.log(person);
  res.json(person)
})


const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)