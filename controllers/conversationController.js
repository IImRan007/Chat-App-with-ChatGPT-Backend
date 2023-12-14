const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");

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
    throw new Error("User does not exist!");
  }

  // Set up and make a request to the OpenAI API
  const openai = new OpenAI({
    apiKey: process.env["OPENAI_KEY"],
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: messages[0].text }],
    model: "gpt-3.5-turbo",
  });

  // Extract the response from the OpenAI API
  const chatGptResponse = chatCompletion.choices[0]?.message?.content || "";

  if (!chatGptResponse || chatGptResponse === "") {
    res.status(400);
    throw new Error("Internal Server Error!");
  }

  // Find an existing conversation or create a new one
  let conversation = await Conversation.findOne({ userId, title });

  if (!conversation) {
    conversation = await Conversation.create({
      userId,
      title,
      messages: [
        { role: "user", content: messages[0].text },
        { role: "assistant", content: chatGptResponse },
      ],
    });
  } else {
    // Append new messages to the existing conversation
    conversation.messages.push({ role: "user", content: messages[0].text });
    conversation.messages.push({ role: "assistant", content: chatGptResponse });
    await conversation.save();
  }

  if (conversation) {
    res.status(201).json({ data: conversation, success: true });
  } else {
    res.status(400);
    throw new Error("Error creating or updating the conversation!");
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
