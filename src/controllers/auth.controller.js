const User = require("../models/user.model");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mail");
const Otp = require("../models/otp");
const otpGenerator = require("otp-generator");
const { createToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { email } = req.body;

    const schema = Joi.object({
      fullname: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await Otp.create({ email, otp });

    await sendMail(email, otp);

    console.log("OTP:", otp);
    res.status(201).json({ message: "Confirmation sent to your email" });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { fullname, email, password, code } = req.body;
    const schema = Joi.object({
      fullname: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      code: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const findOtp = await Otp.findOne({
      email: email,
      otp: code,
      createdAt: { $gt: new Date(new Date() - 60000) },
    });

    if (!findOtp) {
      console.log(findOtp);
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPwd,
    });

    const token = createToken({ id: newUser._id, isAdmin: newUser.isAdmin });
    console.log(token);

    res.status(201).json({ message: "Success", token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = createToken({ id: user._id, isAdmin: user.isAdmin });
    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, verify, login };
