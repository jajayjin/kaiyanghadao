import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { MongoClient,ObjectId } from 'mongodb';
const app=express() 
let database;
const client = new MongoClient(process.env.Mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/api/products', (req,res) =>{
    console.log(req.body);
    res.send(req.body);
    console.log("data received")
});

app.get('/api/collections/:collectionName', async (req, res) => {
    const collectionName = req.params.collectionName;
    console.log(req.params)

    if (!collectionName) {
        return res.status(400).json({ error: 'Collection name is required' });
    }

    try {
        const collection = database.collection(collectionName);
        const document = await collection.findOne({ "branchID": "01" } );
        // const collection = database.collection(collectionName); // Access collection
        
        const data = await collection.find({}).toArray(); // Fetch all documents
        res.status(200).json(document);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
    mongoose.connect(process.env.Mongodb)
    .then(()=> {console.log("connect to database")})
    .catch(()=>{console.log("connect fail")})
    client.connect()
    .then(() => {
        database = client.db('POSKaiyang'); // Your database name
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('Failed to connect to MongoDB:', err));
});