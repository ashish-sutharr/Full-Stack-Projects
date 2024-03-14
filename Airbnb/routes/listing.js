const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema } = require("../Schema.js")
const Listing = require("../models/listing.js")

const validateListing = (req, res , next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(408, errMsg);
    }else{
      next()
    }
  }
  
  
// // start routes
// router.get("/", (req, res) =>{
//     res.send("Listing")
// });

router.get("/" ,  wrapAsync(async (req, res) =>{
  const allListing =  await Listing.find({});
  res.render("listings/index.ejs", {allListing})
}));



// create Listings
router.get("/new" , (req,res) =>{
  res.render("listings/new.ejs");
});

router.post(
  "/", validateListing ,
  wrapAsync(
  async ( req,res, next) =>{
  // let {title, description, image, price, country, location} = req.body;
  const newData = new Listing(req.body.listing)
  await newData.save();
  res.redirect("/listings");
}));

// show route
router.get("/:id" , wrapAsync(async (req, res) =>{
  const {id} =  req.params;
  const listData = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", {listData});
}));

// edit route and update route

router.get("/:id/edit",wrapAsync(async (req,res) =>{
  const {id} =  req.params;
  const listData = await Listing.findById(id); 
  res.render("listings/edit.ejs", {listData});
}));

router.put("/:id", validateListing, wrapAsync(async (req, res) =>{
  const {id} =  req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

// Delete route
router.delete("/:id", wrapAsync(async (req, res) =>{
  const {id} = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  console.log(deletedList);
  res.redirect("/listings")
}));

module.exports = router;