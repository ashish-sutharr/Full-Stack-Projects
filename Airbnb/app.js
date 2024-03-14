const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');

const listings = require("./routes/listing.js")
const reviews = require("./routes/reviews.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() =>{
         console.log("Database connect successfully")
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));

// port start
app.listen("8080", () =>{
  console.log("this app is listning on port 8080")
});



app.use("/listings" , listings);
app.use("/listings/:id/reviews", reviews)



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) =>{
  let{ statusCode= 500, message = "Some thing Went wrong"} = err;
  // res.status(statusCode).send(meassage);
   res.render("error.ejs", {message})
});


