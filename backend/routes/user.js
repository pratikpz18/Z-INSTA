const express = require('express')
const { check, validationResult} = require("express-validator");
const auth = require("../middleware/auth");
const router = express.Router()
const mongoose = require("mongoose");

const usercontroller = require('../controllers/usercontroller')
const User = require('../models/usermodel')

router.post('/register',[
    check("username", "Please Enter a Valid Username")
    .not()
    .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    })
], usercontroller.register)

router.post('/login',[
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ], usercontroller.login)

router.get("/dashboard", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });

router.get("/dashboard/profile/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
      const user = await User.findById(userid);
      res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.get('/dashboard/search/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const user = await User.findById(id);
      res.json(user);
  } catch (e) {
      res.send({ message: "Error in Fetching user" });
  }
});

router.post('/dashboard/search',usercontroller.search)

router.post('/dashboard/search/addfriend',usercontroller.addfriend)

router.post('/dashboard/messages', async (req, res) => {
  try {
      const userid = req.body.userid;
      const user = await User.aggregate([
          { $match: { friendsList: mongoose.Types.ObjectId(userid) } },
      ]);
      if (user.length) {
          res.send(user);
      } else {
          res.send({ message: 'error' });
      }
  } catch (e) {
      res.send(e);
  }
});

router.put('/dashboard/editprofile/:userid',usercontroller.editprofile);

router.get('/dashboard/profile/allusers/:userid', async (req,res) => {
  try{
    const userid = req.params.userid;
    let user=await User.find({ _id: { $ne: userid } }).limit(3)
    if(!user){
      console.log("err");
    } else{
        res.status(200).json(user);
    }
  }
  catch(err){
    res.status(500).json(err)
  }
});

module.exports = router
