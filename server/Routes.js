let messages = require('./Message')
const router = require('express').Router()
const fs = require('fs')


router.get('/', (req, res) => {
    messages.find().select('name content -_id')
    .then(msgs => {
        fs.appendFile('myNewFile.txt', msgs, (err) => {
            if (err) console.log(err);
        })
        console.log(msgs)
        res.send('File Created')
    })
})

module.exports = router