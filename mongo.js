const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://liiinder:${password}@cluster0.i2dns.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3) {
    console.log('Phonebook:')
    Person.find()
        .then(result => {
            result.forEach(entry => {
                console.log(entry.name + ' ' + entry.number)
            })
            mongoose.connection.close()
        })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    const phonebook = new Person({
        name: name,
        number: number
    })

    phonebook.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}