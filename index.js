const express = require("express")
const  cors = require("cors")
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors({
    origin: '*'
}))
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://AultLy:xMZLhxdQJalBTjDj@cluster0.jtcqgec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const database = client.db("AultLy");
const queryCollection = database.collection("queries");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.post('/queries', async(req, res)=>{
      const query = req.body
      const result = await queryCollection.insertOne(query)
      res.send(result)
    })
    app.get('/queries', async(req, res)=>{
      const result = await queryCollection.find().toArray()
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('aultly is running')
})

app.listen(port, ()=>{
    console.log("server is running on port ", port)
})