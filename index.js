const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dpphli.mongodb.net/?appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,  
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const artCollection = client.db('artAndCraftDB').collection('artAndCraft');

        // const userCollection = client.db


        app.get('/artAndCraft', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/artAndCraft', async (req, res) => {
            const newArtAndCraft = req.body;
            console.log(newArtAndCraft);
            const result = await artCollection.insertOne(newArtAndCraft);
            res.send(result);
        })
        app.get('/myArtAndCraft/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await artCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })

        app.put('/updateArtAndCraft/:_id', async (req, res) => {
            const id = req.params._id;
            // console.log(id);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedArtAndCraft = req.body;
            const artAndCraft = {
                $set: {
                    imageUrl: updatedArtAndCraft.imageUrl, itemName: updatedArtAndCraft.itemName, subcategoryName: updatedArtAndCraft.subcategoryName,
                    description: updatedArtAndCraft.description, price: updatedArtAndCraft.price, rating: updatedArtAndCraft.rating,
                    customization: updatedArtAndCraft.customization, processingTime: updatedArtAndCraft.processingTime,
                    stockStatus: updatedArtAndCraft.stockStatus, email: updatedArtAndCraft.email, userName: updatedArtAndCraft.userName
                }
            }
            const result = await artCollection.updateOne(filter,artAndCraft,options);
            res.send(result);
        })

        app.get('/singleArtAndCraft/:_id', async (req, res) => {
            const id= (req.params._id);
            const result = await artCollection.findOne({ _id: new ObjectId(id) ,});
            // console.log(result);
            res.send(result); 
        })

        app.delete('/deleteArtAndCraft/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.deleteOne(query);
            // console.log(result);
            res.send(result);
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Art and craft making server is running')
})

app.listen(port, () => {
    console.log(`Art and craft server is running on port:${port}`)
})