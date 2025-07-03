const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");


const { connect } = require('../database/db'); 
const User = require("../model/userModel");
const Project = require("../model/projectModel");
const Task = require("../model/taskModel");
dotenv.config();

(async () => {
    try {
        console.log("  Seeding started");

       await connect();
        console.log("✅  Connected");

        await Promise.all([
            User.deleteMany({}),
            Project.deleteMany({}),
            Task.deleteMany({})
        ]);

     const testUser = await User.create({ name: "Test User", email: "test@example.com", password: "Test@123" });

        const projects = await Project.create([
            { title: "Testing", description: "description testing", status: "active", userId: testUser._id },
            { title: "Mobile App", description: "Develop Mobile App", status: "active", userId: testUser._id }
        ]);

        const findProject = t => projects.find(p => p.title === t);
        const tasks = [

            {
                title: "Setup project",
                description: "Initialize React app",
                status: "done",
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                projectId: findProject("Testing")._id,
                userId: testUser._id
            },
            {
                title: "TESTING1",
                description: "TESTING1",
                status: "in-progress",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                projectId: findProject("Mobile App")._id,
                userId: testUser._id
            },
            {
                title: "TESTING2",
                description: "TESTING2",
                status: "todo",
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                projectId: findProject("Mobile App")._id,
                userId: testUser._id
            }
        ];

        await Promise.all(tasks.map(t => Task.create(t)));

        const [totalUsers, totalProjects, totalTasks] = await Promise.all([
            User.countDocuments(),
            Project.countDocuments(),
            Task.countDocuments()
        ]);

        console.log(`
📋  Summary
  • Users    : ${totalUsers}
  • Projects : ${totalProjects}
  • Tasks    : ${totalTasks}

🔐  Test creds
  • test@example.com  /  Test@123
  • demo@example.com  /  Demo@123
`);

    } catch (err) {
        console.error("❌  Seed failed:", err);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        console.log("🔌  Connection closed");
    }
})();
