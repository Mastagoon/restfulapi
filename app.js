const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");

//connect to database
mongoose.connect(process.env.DB_CONNECTION
	,{ useNewUrlParser: true },
	 () => console.log("Connected."));
	
//Import routes
const postsRoute = require("./routes/posts");
const authRoute = require("./routes/auth");

//Middlewares
app.use(express.json());
//Route Middlewares
app.use("/posts", postsRoute);
app.use("/api/user", authRoute);


app.get("/", (req, res) => {
	res.send("sup");
});



app.listen(3000);
