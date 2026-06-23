const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

dotenv.config();
const app = express()
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const db = client.db('FitNova');

        const classes = db.collection('classes');
        const bookings = db.collection('bookings');

        app.get('/all-classes', async (req, res) => {
            const cursor = classes.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/all-classes/:id', async (req, res) => {
            const { id } = req.params
            const query = { _id: new ObjectId(id) };
            const result = await classes.findOne(query);
            res.send(result);
        })

        app.post('/all-classes', async (req, res) => {
            const allClasses = req.body
            const result = await classes.insertOne(allClasses).toArray();
            res.json(result)
        })

        app.delete('/all-classes/:userId', async (req, res) => {
            const { user_id } = req.params
            const result = await all - classes.deleteOne({ userId: user_id }).toArray();
            res.json(result)
        })

        app.patch('/all-classes/:id', async (req, res) => {
            const { id } = req.params
            const classUpdate = req.body
            const result = await classes.updateOne(
                { _id: new ObjectId(id) }, { $set: classUpdate }
            )
            res.json(result);
        })

        app.get('/booking/:userId', async (req, res) => {
            const { userId } = req.params
            const result = await bookings.find({ userId: userId }).toArray();
            res.json(result);
        })

        app.post('/booking', async (req, res) => {
            const bookingClasses = req.body
            const result = await bookings.insertOne(bookingClasses).toArray();
            res.json(result);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);