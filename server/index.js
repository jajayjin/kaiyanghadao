import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


import { MongoClient,ObjectId } from 'mongodb';
const app=express() 
let database;
const client = new MongoClient(process.env.Mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
// const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
    origin: 'http://localhost:3000', // Allow React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true // Allowed HTTP methods
}));

app.get('/menu', async (req,res) =>{
    try{
    const collection = database.collection("Productsthainame");
    const data = await collection.find({}).sort({ "category": -1 }).toArray(); 
    res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

//staffsearch
app.post('/seachproductstaff', async (req,res) =>{
    try{
    // console.log(req.body.Namesearch)
    let s = req.body.Namesearch
    const regex = new RegExp(s, 'i');
    const collection = database.collection("Productsthainame");
    const data = await collection.find({"Thainame":regex}).toArray(); 
    res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});
app.post('/seachbydropdown', async (req,res) =>{
    try{
    // console.log(req.body.Category)
    let s = req.body.Category
    if( s == "All"){const collection = database.collection("Productsthainame");
        const data = await collection.find({}).toArray(); 
        res.status(200).json(data);}else{
    const regex = new RegExp(s, 'i');
    const collection = database.collection("Productsthainame");
    const data = await collection.find({"category":regex}).toArray(); 
    res.status(200).json(data);}
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

//sellsummary
app.post('/submit-sale', async (req, res) => {
    try {
        console.log("Starting to process sales...");
        const { date, branchID, productCounts } = req.body; // Added branchID to destructuring
        
        // Validation of request body
        if (!date || !branchID || !productCounts || typeof productCounts !== 'object') {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        console.log("Date:", date);
        console.log("BranchID:", branchID);
        console.log("ProductCounts:", productCounts);

        const collection = database.collection("SumSell");

        for (const [productId, quantity] of Object.entries(productCounts)) {
            // Check if the date and productId exist
            const result = await collection.updateOne(
                { date, branchID, "products.productId": productId }, // Match by date, branchID, and productId
                {
                    $inc: { "products.$.quantitySold": quantity } // Increment quantity if product exists
                }
            );

            if (result.matchedCount === 0) {
                // If no match found, push new product into the array
                await collection.updateOne(
                    { date, branchID }, // Match by date and branchID
                    {
                        $push: {
                            products: { productId, quantitySold: quantity } // Add new product
                        }
                    },
                    { upsert: true } // Create document if it doesn't exist
                );
            }
        }

        res.status(200).json({ message: 'Sales data updated successfully' });
    } catch (error) {
        console.error('Error updating sales:', error);
        res.status(500).json({ error: 'Failed to update sales' });
    }
});

app.post('/sellsummary', async (req, res) => {
    
    try {console.log("Request body received:", req.body);
        console.log("sell summary");
        const { date, branchID } = req.body; // Extract branchID from req.body
        console.log(branchID)
        // Validate the request body
        if (!date || !branchID) {
            return res.status(400).json({ error: 'Missing required fields: date or branchID' });
        }

        console.log("Fetching sales summary...");
        console.log("Date:", date);
        console.log("BranchID:", branchID);

        const collection = database.collection("SumSell");

        // Filter by date and branchID
        const data = await collection.findOne({ date, branchID });

        if (!data) {
            return res.status(404).json({ message: "No sales data found for the provided date and branch." });
        }

        // Filter products with sales
        const filteredProducts = data.products.filter(product => product.quantitySold > 0);

        if (filteredProducts.length === 0) {
            return res.status(404).json({ message: "No products sold on the provided date." });
        }

        const productIds = filteredProducts.map(p => p.productId);

        // Fetch product details
        const productDetails = await database.collection("Productsthainame")
            .find({ id: { $in: productIds } })
            .sort({ category: -1 })
            .toArray();

        // Transform productDetails to a dictionary for faster lookups
        const productDetailsMap = productDetails.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
        }, {});

        // Enrich the product data
        const enrichedProducts = filteredProducts.map(product => {
            const match = productDetailsMap[product.productId];
            return {
                productId: product.productId,
                quantitySold: product.quantitySold,
                name: match?.Thainame || "Unknown Product",
                price: match?.price || 0
            };
        });

        // Send the response with the filtered and enriched products
        res.status(200).json({ date: data.date, products: enrichedProducts });

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

app.post('/submit-money', async (req, res) => {
    try {
        console.log("Starting to process money...");
        let { date, moneysub, branchID,finalprofit  } = req.body; // Destructure body parameters
        console.log("Date:", date);
        console.log("BranchID:", branchID);
        console.log("moneysub:", moneysub);
        // Ensure moneysub is an array, wrap it if it's not
        if (!Array.isArray(moneysub)) {
            moneysub = [moneysub];
        }

        // Validate request body
        if (!date || !branchID || !Array.isArray(moneysub)) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const collection = database.collection("Summarysales");

        // Update the document by replacing the entire moneysub array
        const result = await collection.updateOne(
            { date, branchID }, // Match document by date and branchID
            {
                $set: { 
                    // date, 
                    // branchID, 
                    moneysub // Replace the entire moneysub array with the new one
                },
            },
            { upsert: true } // Create a new document if none matches
        );

        console.log(result);  // For debugging the result

        if (result.upsertedCount > 0) {
            console.log("A new document was created.");
        } else if (result.modifiedCount > 0) {
            console.log("The document was updated.");
        }

        res.status(200).json({ message: 'Sales data updated successfully' });
    } catch (error) {
        console.error('Error updating sales:', error);
        res.status(500).json({ error: 'Failed to update sales' });
    }
});
app.post('/checktotalsales', async (req, res) => {
    try {
        console.log("Starting to process money...");
        let { date, moneysub, branchID,finalprofit  } = req.body; // Destructure body parameters
        console.log("Date:", date);
        console.log("BranchID:", branchID);
        console.log("moneysub:", moneysub);
        // Ensure moneysub is an array, wrap it if it's not
        if (!Array.isArray(moneysub)) {
            moneysub = [moneysub];
        }

        // Validate request body
        if (!date || !branchID || !Array.isArray(moneysub)) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const collection = database.collection("Summarysales");

        // Update the document by replacing the entire moneysub array
        const result = await collection.updateOne(
            { date, branchID }, // Match document by date and branchID
            {
                $set: { 
                    // date, 
                    // branchID, 
                    moneysub // Replace the entire moneysub array with the new one
                },
            },
            { upsert: true } // Create a new document if none matches
        );

        console.log(result);  // For debugging the result

        if (result.upsertedCount > 0) {
            console.log("A new document was created.");
        } else if (result.modifiedCount > 0) {
            console.log("The document was updated.");
        }

        res.status(200).json({ message: 'Sales data updated successfully' });
    } catch (error) {
        console.error('Error updating sales:', error);
        res.status(500).json({ error: 'Failed to update sales' });
    }
});
app.post('/sales', async (req, res) => {
    try {console.log("Request body received:", req.body);
        console.log("sales summary");
        const { date, branchID } = req.body; // Extract branchID from req.body
        console.log(branchID)
        // Validate the request body
        if (!date || !branchID) {
            return res.status(400).json({ error: 'Missing required fields: date or branchID' });
        }

        console.log("Fetching sales summary...");
        console.log("Date:", date);
        console.log("BranchID:", branchID);

        const collection = database.collection("Summarysales");

        // Filter by date and branchID
        const data = await collection.findOne({ date, branchID });

        if (!data) {
            return res.status(404).json({ message: "No sales data found for the provided date and branch." });
        }
        console.log(data.moneysub[0])
        // Filter products with sales
       

        // Send the response with the filtered and enriched products
        res.status(200).json({ moneysub: data.moneysub[0]});

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});




  //login
app.post('/login', async (req, res) => {
try {
    console.log("login back")
    const { username, pass } = req.body;
    console.log(username)
    console.log(pass)
    // Access the Staff collection
    const staffCollection = database.collection("Staff");
    // const managerCollection = database.collection("Manager");
    // Find the staff member by username
    const staff = await staffCollection.findOne({ "username": username });
    console.log(pass.toString())
    if (!staff) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the password is correct
   const isPasswordValid = await (pass === staff.pass);
    if (!isPasswordValid) {
        console.log("not pass password")
        return res.status(401).json({ error: "Invalid credentials" ,status : "0"}); 
    }
    console.log("pass password")
    // Generate JWT token
    const token = jwt.sign(
        { id: staff.branchID, username: staff.username, role: staff.role },
        process.env.jwtSecret,
        { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token,name: staff.name,role: staff.role,branchid:staff.branchID });
    } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error",status : "0" });
    }
});

// Middleware for token verification
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = user;
    next();
    });
}

    // Example of a protected route
    app.post("/sellsummary", authenticateToken, async (req, res) => {
      try {
        const { date } = req.body;
        const collection = database.collection("SumSell");
    
        const data = await collection.findOne({ date });
        if (!data) {
          return res.status(404).json({ message: "No data found for the provided date." });
        }
    
        const filteredProducts = data.products.filter(product => product.quantitySold > 0);
        if (filteredProducts.length === 0) {
          return res.status(404).json({ message: "No products sold on the provided date." });
        }
    
        res.status(200).json({ message: "Authorized", data: filteredProducts });
      } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Internal server error" });
      }
  });
  
  




app.get('/api/collections/:collectionName/:id', async (req, res) => {
    const collectionName = req.params.collectionName;
    const ID = req.params.id;
    // console.log(req.params)

    if (!collectionName) {
        return res.status(400).json({ error: 'Collection name is required' });
    }

    try {
        const collection = database.collection(collectionName);
        const document = await collection.findOne({ "branchID": ID } );
        // const collection = database.collection(collectionName); // Access collection
        
        const data = await collection.find({}).toArray(); // Fetch all documents
        res.status(200).json(document);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

//stock
app.get('/stockfood', async (req,res) =>{
    try{
    // console.log("stockfood")
    const collection = database.collection("Stockfood");
    const data = await collection.find({}).toArray(); 
    // console.log(data)
    res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});
app.get('/stockgadget', async (req,res) =>{
    try{
    const collection = database.collection("Stockgadget");
    const data = await collection.find({}).toArray(); 
    res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});
app.post('/updatestock', async (req,res) =>{
    try{
    let {productData,products,date,branchID} = req.body;
    // console.log("update stock")
    // console.log(branchID)
    let food = productData
    let gadget = products;
    const collection = database.collection("Stockbyday");
    if (!Array.isArray(products)) {
        console.log("gadget")
        products = [products];
    }
    if (!Array.isArray(productData)) {
        productData = [productData];
    }
    // Validate request body
    if (!date || !branchID || !Array.isArray(productData) || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    // Update the document by replacing the entire moneysub array
    const result = await collection.updateOne(
        { date, branchID }, // Match document by date and branchID
        {
            $set: { 
               // Replace the entire moneysub array with the new one
                products,productData
            },
        },
        { upsert: true } // Create a new document if none matches
    );

    console.log(result);  // For debugging the result

    if (result.upsertedCount > 0) {
        console.log("A new document was created.");
    } else if (result.modifiedCount > 0) {
        console.log("The document was updated.");
    }

    res.status(200).json({ message: 'Sales data updated successfully' });
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