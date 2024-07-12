const { Router } = require("express");
const router = Router();

const {
  create,
  show,
  update,
  remove,
} = require("../controllers/food.controller");
const isAdmin = require("../middlewares/is-admin-middleware");

const route = "/food";

router.post(`${route}/`, isAdmin, create);
router.get(`${route}/`, show);
router.put(`${route}/:id`, isAdmin, update);
router.delete(`${route}/:id`, isAdmin, remove);

module.exports = router;
