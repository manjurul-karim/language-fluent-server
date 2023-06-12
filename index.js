const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jvrjlhy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const courseCollection = client.db("languageDB").collection("course");
    const selectCourseCollection = client
      .db("languageDB")
      .collection("selectCourse");
    const paymentCollection = client.db("languageDB").collection("payments");

    //  ! All course
    app.get("/course", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });

    // !Select Course

    app.get("/selectcourse", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      // if (!email) {
      //   res.send([]);
      // }

      const query = { email: email };
      const result = await selectCourseCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/selectcourse", async (req, res) => {
      const singleCourse = req.body;
      console.log(singleCourse);
      const result = await selectCourseCollection.insertOne(singleCourse);
      res.send(result);
    });

    app.delete("/selectcourse/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await selectCourseCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("language server is running");
});

app.listen(port, () => {
  console.log(`language is running on port: ${port}`);
});
