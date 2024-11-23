//Import dependencies modules:
const express = require('express');
const Collection = require('mongodb/lib/collection');
const { checkCollectionName } = require('mongodb/lib/utils');
// const bodyParser = require('body-parser')

//Create an Express.js instance:
const app = express()

//config Express.js
app.use(express.json())
app.set('port', 3000)
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
})

//connect to mongodb
const MongoClient = require('mongodb').MongoClient;

let db;
//Mongo Client.connect('mongodb+srv://MyMongoDBUser:wednesday@cluster0.epqbr.mongodb.net', )
MongoClient.connect('mongodb+srv://ammar5910s:Funnyb0y@cluster0.y2a6x.mongodb.net/', (err, client) =>{

db = client.db('knowledge zone') // Paste your database name here
})

app.get('/', (req, res, next) =>{
    res.send('Select a collection, e.g., /collection/messages')
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    //console.log('collection name:', req.collection) 
    return next()

})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

// adding post
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if(e) return next(e)
        res.send(results.ops)
    })
})

// return with object id
const ObjectID = require("mongodb").ObjectID;
app.get("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e);
    res.send(result);
  });
});

// update an object
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        { _id: new ObjectID(req.params.id) }, { $set: req.body }, { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
        })
})

// app.listen(3000, () =>{
//     console.log('Express.js server running at http://localhost:3000');
// })

const port = process.env.PORT || 3000
    app.listen(port)