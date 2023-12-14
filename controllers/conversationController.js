const asyncHandler = require("express-async-handler");

const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

// POST /api/conversation
const createConversation = asyncHandler(async (req, res) => {
  const { userId, title, messages } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("Please provide the User Id!");
  }
  if (!title) {
    res.status(400);
    throw new Error("Please provide the Conversation Title!");
  }

  const userExists = await User.findOne({ _id: userId });

  if (!userExists) {
    res.status(400);
    throw new Error("User not exists!");
  }

  const conversation = await Conversation.create({
    userId,
    title,
    messages,
  });

  if (conversation) {
    res.status(201).json({ data: conversation, success: true });
  } else {
    res.status(400);
    throw new Error("Error createing new conversation!");
  }
});

// GET /api/conversation/:id
const getConversation = asyncHandler(async (req, res) => {
  const conversationId = req?.params?.id;

  if (!conversationId) {
    res.status(400);
    throw new Error("Please provide the conversation ID.");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found!");
  }

  res.status(200).json({ data: conversation, success: true });
});

// PUT /api/conversation/:id
const updateConversationTitle = asyncHandler(async (req, res) => {
  const { title } = req?.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is requried.");
  }

  const conversationId = req?.params?.id;

  if (!conversationId) {
    res.status(400);
    throw new Error("Please provide the conversation ID.");
  }

  const conversation = await Conversation.findByIdAndUpdate(
    conversationId,
    {
      title: title,
    },
    {
      new: true,
    }
  );

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found!");
  }

  res.status(200).json({ conversation, success: true });
});

// DELETE /api/conversation/:id
const deleteConversation = asyncHandler(async (req, res) => {
  const conversationId = req?.params?.id;

  if (!conversationId) {
    res.status(400);
    throw new Error("Please provide the conversation ID.");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found!");
  }

  await Conversation.deleteOne({ _id: conversationId });

  res.status(200).send({ success: true });
});

module.exports = {
  createConversation,
  getConversation,
  updateConversationTitle,
  deleteConversation,
};
