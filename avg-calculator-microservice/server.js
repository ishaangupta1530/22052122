require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;

const API_URLS = {
  users: "http://20.244.56.144/evaluation-service/users",
  userPosts: (userId) => `http://20.244.56.144/evaluation-service/users/${userId}/posts`,
  postComments: (postId) => `http://20.244.56.144/evaluation-service/posts/${postId}/comments`,
};

const CLIENT_ID = "daa2a091-2e8b-4175-83ae-62e6ac8478a3";
const CLIENT_SECRET = "RNguRZSXqPKGBSNy";
const AUTH_URL = "http://20.244.56.144/evaluation-service/auth";

let accessToken = null;

// Function to authenticate and get the access token
const authenticate = async () => {
  try {
    const authResponse = await axios.post(AUTH_URL, {
      email: "22052122@kiit.ac.in",
      name: "ishaan gupta",
      rollNo: "22052122",
      accessCode: "nwpwrZ",
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });

    accessToken = authResponse.data.access_token;
    console.log("Authentication successful. Token acquired.");
  } catch (error) {
    console.error("Authentication failed:", error.response?.data || error.message);
    throw new Error("Authentication failed");
  }
};

// Middleware to check authentication before making API calls
const ensureAuthenticated = async (req, res, next) => {
  if (!accessToken) {
    try {
      await authenticate();
    } catch (error) {
      return res.status(500).json({ error: "Authentication failed" });
    }
  }
  next();
};

// Fetch all users
app.get("/users", ensureAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(API_URLS.users, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch users:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Fetch posts of a specific user
app.get("/users/:userid/posts", ensureAuthenticated, async (req, res) => {
  const { userid } = req.params;
  try {
    const response = await axios.get(API_URLS.userPosts(userid), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch user posts:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

// Fetch comments of a specific post
app.get("/posts/:postid/comments", ensureAuthenticated, async (req, res) => {
  const { postid } = req.params;
  try {
    const response = await axios.get(API_URLS.postComments(postid), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch post comments:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch post comments" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
