var router = require("express").Router();

router.use("/auth", require("./auth.routes"));

export default router;
