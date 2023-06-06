import { Router } from "express";
const router = Router();
import { userData } from "../models/index.js";
import { users } from "../config/mongoCollections.js";

router.route("/").get(async (req, res) => {
  try {
    res.render("about", { title: "about" });
  } catch (error) {
    res.status(500).render("error", { error: error });
  }
});

router.route("/add").get(async(req, res) => {
    try{
        res.render("add", {title : "add a new user"});
    }
    catch(error){
        res.status(500).render("error", {error : error});
    }
})
.post(async(req, res)=>{
  
  try{
    const regData = req.body;

    const uniqueCode = regData.uniqueCode;
    const name = regData.name;
    const address = regData.address;

    const productNames = regData.productName; 
    const discountPercentages = regData.discountPercentage; 

    const newUser = await userData.create(
      uniqueCode,
      name,
      address,
      productNames,
      discountPercentages
    );

    res.redirect("/");
  }
    catch(error){
            console.log(error);
            res.status(404).render("error", { error: error.message });
    }
})

router.route("/search").get(async(req,res)=>{
  try{
    res.render("search", {title : "search by code"});
  } catch(error){
    res.status(500).render("error", {error : error});
  }
}).post(async (req, res) => {
  try {
    const uniqueCode = req.body.uniqueCode;

    const user = await userData.getByUniqueCode(uniqueCode);

    res.render("user", { title: "User Details", user: user });
  } catch (error) {
    console.log(error);
    res.status(404).render("error", { error: error.message });
  }
});

router.route("/generate").get(async (req, res) => {
  try {
    const productNames = req.query.products.split(",");
    const quantities = req.query.quantities.split(",");
    const discounts = req.query.discounts.split(",");

    const user = {
      name: req.query.name,
      address: req.query.address,
      uniqueCode: req.query.uniqueCode,
      products: [],
    };

    for (let i = 0; i < productNames.length; i++) {
      user.products.push({
        productName: productNames[i],
        ProductDiscountPercentage: discounts[i],
        quantity: quantities[i],
      });
    }

    const today = new Date();
    const formattedDate = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`;

    res.render("generate", {
      title: "Generate Invoice",
      user: user,
      currentDate: formattedDate,
    });
  } catch (error) {
    console.log(error);
    res.status(404).render("error", { error: error.message });
  }
});


export default router;