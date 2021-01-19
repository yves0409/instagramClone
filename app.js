const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGO_URI} = require('./keys')

require('./models/users')

app.use(express.json())
app.use(require('./routes/auth'))


mongoose.connect(MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true})

mongoose.connection.on('connected',()=> {
    console.log('Connected to DB');
})

mongoose.connection.on('error',(err)=> {
    console.log('connection to DB failed',err);
})


app.listen(PORT,()=> {
    console.log(`Server is running on port ${PORT}`);
})

