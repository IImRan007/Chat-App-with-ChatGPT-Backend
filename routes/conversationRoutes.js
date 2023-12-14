const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
} = require("../controllers/conversationController");

router.post("/", createConversation);
router.get("/:id", getConversation);

module.exports = router;
