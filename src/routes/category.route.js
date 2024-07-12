const { Router } = require("express");
const router = Router();

const {
  show,
  create,
  update,
  remove,
} = require("../controllers/category.controller");
const isAdmin = require("../middlewares/is-admin-middleware");

const route = "/category";

router.post(`${route}/`, isAdmin, create);
router.get(`${route}/`, show);
router.put(`${route}/:id`, isAdmin, update);
router.delete(`${route}/:id`, isAdmin, remove);

module.exports = router;
