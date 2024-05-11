const express = require("express")
const  cors = require("cors")
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors({
    origin: '*'
}))
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jtcqgec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
const recommendationCollection = database.collection("recommendations");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.post('/queries', async(req, res)=>{
      const query = req.body
      const result = await queryCollection.insertOne(query)
      res.send(result)
    })
    
    app.post('/recommendations', async(req,res)=>{
      const query = req.body
      const result = await recommendationCollection.insertOne(query)
      res.send(result)
    })
    app.get('/recommendations', async(req, res)=>{
      const result = await recommendationCollection.find().toArray()
      res.send(result)
    })
    app.get('/queries', async(req, res)=>{
      const result = await queryCollection.find().toArray()
      res.send(result)
    })
    app.get('/queries/:email', async(req, res)=>{
      const email = req.params.email
      const result =await queryCollection.find({email}).toArray()
      res.send(result)
    })
    app.get('/queryDetails/:id', async(req, res)=>{
      const id = req.params.id
      const query = { _id : new ObjectId(id)}
      const result = await queryCollection.findOne(query)
      res.send(result)
    })
    app.get('/recommendations/:queryId', async(req, res)=>{
      const queryId = req.params.queryId
      const result  = await recommendationCollection.find({queryId}).toArray()
      res.send(result)
     })
    app.put('/queryDetails/:id', async(req , res)=>{
      const id = req.params.id
      const query = req.body
      const filter = {_id : new ObjectId(id)}
      const updateQuery = {
        $set : {
          recommendationCount : parseInt(query.recommendationCount)+1
        }
      }
      const result = await queryCollection.updateOne(filter, updateQuery)
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