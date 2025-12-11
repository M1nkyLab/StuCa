const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- API ROUTES ---

// 1. GET ALL JOBS
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await prisma.application.findMany({
      orderBy: { updated_at: 'desc' } // Show newest activity first
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// 2. CREATE A NEW JOB
app.post("/api/jobs", async (req, res) => {
  try {
    const { company, role, status, job_type, salary, currency, location, job_link, benefits, notes } = req.body;
    
    const newJob = await prisma.application.create({
      data: {
        company, role, status, job_type, salary, currency, location, job_link, benefits, notes
      }
    });
    res.json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// 3. UPDATE A JOB (For Drag & Drop OR Edit Modal)
app.patch("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body; // Can contain status, salary, notes, etc.

    const updatedJob = await prisma.application.update({
      where: { id: id },
      data: data
    });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

// 4. DELETE A JOB
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.application.delete({
      where: { id: id }
    });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});