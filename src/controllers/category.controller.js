const path = require("path");

const Joi = require("joi");
const { v4: uuid } = require("uuid");
const Category = require("../models/category.model");

const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { image } = req.files;
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const findCategory = await Category.findOne({ name });
    if (findCategory)
      return res.status(400).json({ message: "Category already exists" });

    const imageName = `${uuid()}${path.extname(image.name)}`;
    image.mv(`${process.cwd()}/uploads/${imageName}`);

    const newCategory = await Category.create({
      name,
      image: imageName,
    });
    res.json({ message: "Success", newCategory });
  } catch (error) {
    next(error);
  }
};

const show = async (req, res) => {
  try {
    const categories = await Category.find().select("-__v");
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.files?.image;

    const schema = Joi.object({
      name: Joi.string(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const findCategory = await Category.findById(id);
    if (!findCategory)
      return res.status(404).json({ message: "Category not found" });

    let imageName;
    if (image) {
      imageName = `${uuid()}${path.extname(image.name)}`;
      image.mv(`${process.cwd()}/uploads/${imageName}`);
    } else {
      imageName = findCategory.image;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image: imageName },
      { new: true }
    );

    res.json({ message: "Success", updatedCategory });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  create,
  show,
  update,
  remove,
};
