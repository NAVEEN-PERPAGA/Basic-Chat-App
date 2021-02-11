let messages = require('./Message')
const router = require('express').Router()

const fs = require('fs')

router.get('/', (req, res) => {
    messages.aggregate([{$group: {name: "name", content: "content"}}])
    .then(msgs => {
        // const message = JSON.parse(msgs)
        console.log(msgs)
        // fs.appendFile('myNewFile.txt', msgs, (err) => {
        //     if (err) console.log(err);
        //     console.log()
        // })
        res.send('File Created')
    })
})

module.exports = router