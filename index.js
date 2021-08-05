const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const { ObjectID } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8022;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnv3d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("photography").collection("products");
  const bookedCollection = client.db("photography").collection("booking");
  const AdminCollection = client.db("photography").collection("admin");

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    collection.insertOne(newProduct).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/products", (req, res) => {
    collection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  app.get("/viewMore/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    collection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });
  app.get("/buyProduct/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    collection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.delete("/deleteProduct/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    collection.findOneAndDelete({ _id: id }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
  app.post("/productBooked", (req, res) => {
    const orderProduct = req.body;
    bookedCollection.insertOne(orderProduct).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/productList", (req, res) => {
    bookedCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.status(200).send(documents);
      });
  });
  app.get("/orderList", (req, res) => {
    bookedCollection.find().toArray((err, documents) => {
      res.status(200).send(documents);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const order = req.body;
    AdminCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    AdminCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
