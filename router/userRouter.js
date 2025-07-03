const router = require("express").Router();
const userRouter = require("../controller/userController");
const {  verifyTokenAndUser } = require("../middleware/auth");
router.post("/userRegister", userRouter.userRegister);
router.post("/userLogin", userRouter.userLogin);
router.get("/getUserProfile",verifyTokenAndUser, userRouter.getUserProfile);
router.put("/updateProfile",verifyTokenAndUser, userRouter.updateProfile);
router.delete("/deleteProfile",verifyTokenAndUser, userRouter.deleteProfile);
module.exports = router; 