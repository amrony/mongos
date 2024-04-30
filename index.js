const express = require("express");
const mongoose = require('mongoose');
const app = express();
const port = 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create product schema
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// create product model
const Product = mongoose.model("Products", productsSchema);


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/studentDB');
        console.log("Database connected");
    } catch (error) {
        console.log("Database not connected");
        console.log(error);
        process.exit(1);
    }
}



app.get('/', (req, res)=> {
    res.send("Welcomet to home page");
})

app.post('/products', async(req, res)=> {
    try {
        const { title, price, description } = req.body;
        // console.log("Body", title);

        // const newProduct = new Product({
        //     title: title,
        //     price: price,
        //     description: description
        // });

        // only one data save
        // const productData = await newProduct.save();

        //multiple data save
        const productData = await Product.insertMany([
            {
                title: "iphone 12",
                price: 1200,
                description: "wow"
            },
            {
                title: "iphone 11",
                price: 1000,
                description: "awosome"
            }
        ]);

        res.status(201).send(productData);
    } catch (error) {
        res.status(500).send({message: error});
    }
})


app.listen(port, async() => {
    console.log(`Server is running at http://localhost:${port}`);
    await connectDB();
})