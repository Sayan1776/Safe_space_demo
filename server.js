const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const { generateText } = require("ai")
const { groq } = require("@ai-sdk/groq")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, ".")))

// API endpoint for panic detection
app.post("/api/check-panic", async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    // Check for panic using AI SDK with Groq
    const isPanic = await checkPanicWithGroq(message)

    return res.json({ isPanic })
  } catch (error) {
    console.error("Error checking panic:", error)
    return res.status(500).json({ error: "Failed to check panic" })
  }
})

// Function to check panic using Groq's Mixtral model with AI SDK
async function checkPanicWithGroq(message) {
  try {
    // Using AI SDK to generate text with Groq
    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      system:
        "You are an AI safety assistant that detects if a message indicates panic, distress, or a need for help. Respond with true if the message indicates panic or a need for help, and false otherwise. Only respond with true or false, nothing else.",
      prompt: message,
    })

    // Parse the result
    const result = text.trim().toLowerCase()
    return result === "true"
  } catch (error) {
    console.error("Error calling Groq API with AI SDK:", error)
    throw error
  }
}

// Serve the main HTML file for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
