const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://kayttaja:${password}@mycluster.vcvls.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(response => {
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to your phonebook`)
      mongoose.connection.close()
    })
}

if (process.argv.length < 4) {
    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 4) {
    console.log("error: enter both name and number");
    mongoose.connection.close()
}

if (process.argv.length > 5) {
    console.log("error: too many parameters");
    mongoose.connection.close()
}