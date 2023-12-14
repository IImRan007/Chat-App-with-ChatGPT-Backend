const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
  deleteConversation,
  updateConversationTitle,
} = require("../controllers/conversationController");

router.post("/", createConversation);
router
  .route("/:id")
  .get(getConversation)
  .put(updateConversationTitle)
  .delete(deleteConversation);

module.exports = router;
