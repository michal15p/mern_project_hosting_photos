const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");
const postSchema = require('../models/Post');
const fs = require('fs');
router.post("/register", async (req, res) => {
try {
    let { email, password, passwordCheck, displayName } = req.body;
    
    if (!email || !password || !passwordCheck)
        return res.status(400).json({ msg: "Nie wszystkie pola zostały wypełnione" });
    if (password.length < 5)
        return res
            .status(400)
            .json({ msg: "Hasło musi mieć ponad 5 liter" });
    if (password !== passwordCheck)
        return res
            .status(400)
            .json({ msg: "Hasła nie są takie same!" });
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
        return res
            .status(400)
            .json({ msg: "Konto już istnieje" });
    if (!displayName) displayName = email;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
        email,
        password: passwordHash,
        displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    });

router.post("/login", async (req, res) => {
try {
    const { email, password } = req.body;
    
    if (!email || !password)
        return res.status(400).json({ msg: "nie wszystkie pola zostały wypełnione" });
    const user = await User.findOne({ email: email });
    if (!user)
        return res
            .status(400)
            .json({ msg: "Brak zarejestrowanego użytkownika" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Zle" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
    token,
        user: {
            id: user._id,
            displayName: user.displayName,
        },
    });
    } catch (err) {
        res.status(500).json({ error: err.message + "voco"});
    }
});


router.delete("/delete", auth, async (req, res) => {
    try {
        const postsId = await postSchema.find({userId: req.user},{_id:1})
        postsId.forEach(el => {
            postSchema.findById(el, (error, data) => {
                if (error) {
                  console.log(error)
                } else {
                  
                  fs.unlink(data.img.substr(22,data.img.length), (err) => {
                    if (err) {
                      console.error(err)
                    }
                  
                  })
                  console.log("Zdjecie usuniete z serwera")
                }
              })
        })
        console.log("NIE")
        await postSchema.deleteMany({userId: req.user})
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
    displayName: user.displayName,
    id: user._id,
});
});
router.get("/email", auth, async (req, res) => {
    const user = await User.findById(req.user);
    
        res.json({
        email: user.email,
        id: user._id
    });
    });
module.exports = router;