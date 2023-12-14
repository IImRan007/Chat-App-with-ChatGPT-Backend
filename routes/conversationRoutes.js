const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
} = require("../controllers/conversationController");

router.route("/").post(createConversation).get(getConversation);

module.exports = router;
