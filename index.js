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
    rating: {
        type: Number,
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

// Create
app.post('/products', async(req, res)=> {
    try {
        const { title, price, description, rating } = req.body;
        // console.log("Body", title);

        const newProduct = new Product({
            title: title,
            price: price,
            description: description,
            rating: rating
        });

        // only one data save
        const productData = await newProduct.save();

        //multiple data save
        // const productData = await Product.insertMany([
        //     {
        //         title: "iphone 12",
        //         price: 1200,
        //         description: "wow"
        //     },
        //     {
        //         title: "iphone 11",
        //         price: 1000,
        //         description: "awosome"
        //     }
        // ]);

        res.status(201).send(productData);
    } catch (error) {
        console.log("Error", error);
        res.status(500).send({message: error});
    }
})

// Red
app.get('/products', async(req, res)=> {

    try {
        const products = await Product.find();
        if(products){
            res.status(200).send(products);
        }else{
            res.status(404).send({message: "products not found"});
        }
    } catch (error) {
        res.status(500).send({message: error});
    }
})

// Red by id
app.get('/products/:id', async(req, res)=> {

    try {
        const id = req.params.id;

        const product = await Product.findOne({_id:id});

        if(product){
            res.status(200).send(product);
        }else{
            res.status(404).send({message: "products not found"});
        }
    } catch (error) {
        res.status(500).send({message: error});
    }
})



// Red by query parameter
app.get('/product', async (req, res) => {
   
    try {
        const price = req.query.price;
        const rating = req.query.rating;
        let product;
        if(price){
            product = await Product.find({$and: [{ price: { $nin: [price] } }, {rating: {$lte: rating}}]}).sort({ price: 1 });

            if(product){
                res.status(200).send(product);
            }else{
                res.status(404).send({message: "products not found"});
            }

        }else{
             product = await Product.find();

             if(product){
                res.status(200).send(product);
            }else{
                res.status(404).send({message: "products not found"});
            }
        }
       
   
    } catch (error) {
        res.status(500).send({message: error});
    }

   
})



// delete by id
app.delete('/product/delete', async(req, res)=> {

    try {
        const id = req.query.id;

        const product = await Product.deleteOne({ _id: id });

        if(product){
            res.status(200).send({message: "Successfully Product Deleted!"});
        }else{
            res.status(404).send({message: "products not found"});
        }
    } catch (error) {
        res.status(500).send({message: error});
    }
})



app.listen(port, async() => {
    console.log(`Server is running at http://localhost:${port}`);
    await connectDB();
})