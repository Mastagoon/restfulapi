const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {registerValidation, loginValidation} = require("../models/Validation");
const bcrypt = require("bcryptjs");

router.post("/register", async (req,res) => {
	//validation
	const {error} = registerValidation(req.body);
	if(error) {
		return res.status(400).send(error.details[0].message);
	}
	//check if users exists
	const userExists = await User.findOne({email:req.body.email});
	if(userExists) {
		return res.status(400).send("This email is already used.");
	}
	//hashing the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	});
	try {
		const saveUser = await user.save();
		res.send({user: user._id});
	} catch(err) {
		res.status(400).send(err);
	}
});

router.post("/login", async (req, res) => {
	const {error} = loginValidation(req.body);
	if(error) {
		return res.status(400).send(error.details[0].message);
	}
	//check if user exists
	const user = await User.findOne({email:req.body.email});
	if(!user) {
		return res.status(400).send("Invalid login information.");
	}
	//check if password is correct
	const passwordValid = await bcrypt.compare(req.body.password, user.password);
	if(!passwordValid) {
		return res.status(400).send("your password is not correct.");
	}
	//creating token
	const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
	res.header("auth-token", token).send(token);
})

module.exports = router;