

const { checkToken } = require("../utils/jwt");

const isAdmin = async (req, res, next) => {
  if (!req.headers.token) {
    return res.status(401).json({ message: "Permission Denied" });
  }

  checkToken(req.headers.token, async (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Permission Denied" });
    }

    req.user = data;
    console.log(data);

    if (!data.isAdmin) {
      console.log(data.isAdmin);
      return res.status(401).json({ message: "Permission Denied" });
    }
    next();
  });
};

module.exports =  isAdmin ;
