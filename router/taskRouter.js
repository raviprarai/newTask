const router = require("express").Router();
const { get } = require("http");
const taskRouter = require("../controller/taskController");
const { verifyTokenAndUser } = require("../middleware/auth");

router.post("/addTask", verifyTokenAndUser, taskRouter.addTask);
router.put("/updateTask/:id", verifyTokenAndUser, taskRouter.updateTask);
router.get("/getAllOwnTask", verifyTokenAndUser, taskRouter.getAllOwnTask);
router.get("/getTaskByProjectId/:projectId", verifyTokenAndUser, taskRouter.getTaskByProjectId);
router.get("/getOneTask/:id", verifyTokenAndUser, taskRouter.getOneTask);
router.get("/findTaskByStatus", verifyTokenAndUser, taskRouter.findTaskByStatus);
router.get("/allTask", verifyTokenAndUser, taskRouter.allTask);
router.delete("/deleteTask/:id", verifyTokenAndUser, taskRouter.deleteTask);

module.exports = router; 