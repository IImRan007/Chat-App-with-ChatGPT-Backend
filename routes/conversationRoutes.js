const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
  deleteConversation,
  updateConversationTitle,
  getAllConversations,
  getUserConversation,
} = require("../controllers/conversationController");

router.post("/", createConversation);
router.get("/all", getAllConversations);
router.get("/:userId", getUserConversation);
router
  .route("/:id")
  .get(getConversation)
  .put(updateConversationTitle)
  .delete(deleteConversation);

module.exports = router;
