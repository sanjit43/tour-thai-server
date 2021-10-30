const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

//Add middleware
app.use(cors())
app.use(express.json());


//Connect with mongodb atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0bfuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('thai_tour');
        const serviceCollection = database.collection('service')
        const addressCollection = database.collection('address');

        // const add = { city: 'dhaka', country: 'bangladesh' }
        // await addressCollection.insertOne(add)


        //GET DATA
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })
        // Post Data into address section
        app.post('/address', async (req, res) => {
            const address = req.body;
            const result = await addressCollection.insertOne(address)
            res.json(result)
        })
    }
    finally {
        //    await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello from thailand tour')
})

app.get('/hellow', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log('This server is hitting from port', port)
})