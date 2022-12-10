const router = require("express").Router();
const User = require("./../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// create an user

router.post("/users", async (req, res) => {
  try {
    const { email, passwordHash, verifyPasswordHash } = req.body;
    if (!email || !passwordHash || !verifyPasswordHash) {
      return res
        .status(400)
        .json({ errorMessage: "Please Enter All Required Field" });
    }
    if (passwordHash.length < 6) {
      return res.status(400).json({
        errorMessage: "Please enter password of atleast of a 6 character",
      });
    }
    if (passwordHash != verifyPasswordHash) {
      return res.status(400).json({ errorMessage: "Password didn't match" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ errorMessage: "Email already exists!" });
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(passwordHash, salt);

    const newUser = new User({
      email,
      passwordHash: hash,
    });

    const saveUser = await newUser.save();

    // make user logged in to the site
    const token = jwt.sign(
      {
        user: saveUser._id,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send(saveUser);
  } catch (error) {
    res.status(500).send();
  }
});

// log to in

router.post("/login", async (req, res) => {
  try {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
      return res
        .status(500)
        .json({ errorMessage: "Please Enter All Required Field" });
    }

    const exists = await User.findOne({ email });
    if (!exists) {
      return res
        .status(400)
        .json({ errorMessage: "Incorrect email or password!" });
    }
    const isPasswordCorrect = await bcrypt.compare(passwordHash, exists.passwordHash);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ errorMessage: "Incorrect email or password!" });
    }
    const token = jwt.sign(
      {
        user: exists._id,
      },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  }
  
  
  catch (error) {
    res.status(500).send();
  }


});

// logout user

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

module.exports = router;
