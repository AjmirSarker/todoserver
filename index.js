const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://arafat123:${process.env.DB_PASS}@cluster0.xbuyt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('todolist').collection('lists');

        // Tasks
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        // Post item
        app.post('/tasks', async (req, res) => {
            const newItem = req.body;
            const result = await taskCollection.insertOne(newItem);
            res.send(result);
        });
         // Delete item
         app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });
        //get by email
        app.get('/taskss',async(req,res)=>{
            const email = req.query.email;
            const query = {email:email};
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        })

    }
    finally { }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})