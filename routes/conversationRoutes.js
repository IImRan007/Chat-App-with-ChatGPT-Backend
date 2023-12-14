const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
  deleteConversation,
} = require("../controllers/conversationController");

router.post("/", createConversation);
router.route("/:id").get(getConversation).delete(deleteConversation);

module.exports = router;
