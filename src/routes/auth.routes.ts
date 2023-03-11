// const { verifySignUp } = require("../middleware");
// const controller = require("../controllers/AuthController");
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";
var router = require("express").Router();

const authController: AuthController = new AuthController();
const authMiddleWare: AuthMiddleWare = new AuthMiddleWare();
const verifyToken = authMiddleWare.verifyToken;

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.delete("/logout", verifyToken, authController.logout);
router.post("/refreshToken", authController.refreshToken);

module.exports = router;
