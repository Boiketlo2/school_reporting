const express = require("express");
const router = express.Router();
const monitoringController = require("../controllers/monitoringController");

// GET monitoring data based on user role
// Frontend path: /api/monitoring/:role/:userId
router.get("/:role/:userId", (req, res) => {
  const { role, userId } = req.params;

  if (!role || !userId) {
    return res.status(400).json({ error: "role and userId params are required" });
  }

  // Attach user object for the controller
  req.user = {
    id: parseInt(userId, 10),
    role: role.toLowerCase(), // normalize role string
  };

  monitoringController.getMonitoring(req, res);
});

module.exports = router;
