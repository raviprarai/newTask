const router = require("express").Router();
const projectRouter = require("../controller/project");
const { verifyTokenAndUser } = require("../middleware/auth");

router.post("/userAddProject", verifyTokenAndUser, projectRouter.userAddProject);
router.put("/updateProject/:id", verifyTokenAndUser, projectRouter.updateProject);
router.get("/getAllOwnProject", verifyTokenAndUser, projectRouter.getAllOwnProject);
router.get("/allProject", verifyTokenAndUser, projectRouter.allProject);
router.get("/getOneProject/:id", verifyTokenAndUser, projectRouter.getOneProject);
 router.delete("/deleteProject/:id",verifyTokenAndUser, projectRouter.deleteProject);

module.exports = router; 