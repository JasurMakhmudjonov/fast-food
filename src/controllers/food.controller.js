const path = require("path");
const Joi = require("joi");
const { v4: uuid } = require("uuid");
const Category = require("../models/category.model");
const Food = require("../models/food.model");

const create = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    const { image } = req.files;

    const schema = Joi.object({
      name: Joi.string().required(),
      price: Joi.string().required(),
      categoryId: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    }

    const findCategory = await Category.findById(categoryId);
    if (!findCategory) {
      res.status(404).json({ message: "Category not found" });
    }

    const imageName = `${uuid()}${path.extname(image.name)}`;
    image.mv(`${process.cwd()}/uploads/${imageName}`);

    const newFood = await Food.create({
      name,
      price,
      image: imageName,
      categoryId,
    });

    res.status(200).json({ message: "Food created", newFood });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const show = async (req, res) => {
  try {
    const foods = await Food.find().select("-__v");
    res.json({ foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId } = req.body;
    const image = req.files?.image;

    console.log("Request body", req.body);

    const schema = Joi.object({
      name: Joi.string(),
      price: Joi.string(),
      categoryId: Joi.string(),
    });

    console.log("Request body", req.body);

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    }

    const findCategory = await Category.findById(categoryId);
    if (!findCategory) {
      res.status(404).json({ message: "Category not found" });
    }

    const findFood = await Food.findById(id);
    if (!findFood) {
      res.status(404).json({ message: "Food not found" });
    }

    let imageName;
    if (image) {
      imageName = `${uuid()}${path.extname(image.name)}`;
      image.mv(`${process.cwd()}/uploads/${imageName}`);
    } else {
      imageName = findFood.image;
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      { name, price, categoryId, image: imageName },
      { new: true }
    );

    res.status(200).json({ message: "Updated", updatedFood });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const findFood = await Food.findById(id);
    if (!findFood) {
      res.status(404).json({ message: "Food not found" });
    }

    await Food.findByIdAndDelete(id);
    res.json({ message: "Food deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  create,
  show,
  update,
  remove,
};
