document.addEventListener("DOMContentLoaded", () => {
    // Mobile navigation toggle
    const hamburger = document.querySelector(".hamburger")
    const navLinks = document.querySelector(".nav-links")
  
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active")
      })
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)
  
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })
  
          // Close mobile menu if open
          if (navLinks.classList.contains("active")) {
            navLinks.classList.remove("active")
          }
        }
      })
    })
  
    // Panic detection form
    const panicForm = document.getElementById("panic-form")
    const messageInput = document.getElementById("message-input")
    const resultElement = document.getElementById("result")
    const resultIcon = document.getElementById("result-icon")
    const resultMessage = document.getElementById("result-message")
    const loadingElement = document.getElementById("loading")
  
    if (panicForm) {
      panicForm.addEventListener("submit", async (e) => {
        e.preventDefault()
  
        const message = messageInput.value.trim()
  
        if (!message) {
          return
        }
  
        // Show loading indicator
        resultElement.classList.add("result-hidden")
        loadingElement.classList.remove("loading-hidden")
  
        try {
          const response = await fetch("/api/check-panic", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
          })
  
          if (!response.ok) {
            throw new Error("Network response was not ok")
          }
  
          const data = await response.json()
  
          // Hide loading indicator
          loadingElement.classList.add("loading-hidden")
  
          // Show result
          resultElement.classList.remove("result-hidden")
  
          if (data.isPanic) {
            resultElement.className = "result-danger"
            resultIcon.textContent = "🚨"
            resultMessage.textContent = "Panic Detected!"
          } else {
            resultElement.className = "result-success"
            resultIcon.textContent = "✅"
            resultMessage.textContent = "All Clear"
          }
        } catch (error) {
          console.error("Error:", error)
  
          // Hide loading indicator
          loadingElement.classList.add("loading-hidden")
  
          // Show error result
          resultElement.classList.remove("result-hidden")
          resultElement.className = "result-danger"
          resultIcon.textContent = "❌"
          resultMessage.textContent = "Error checking message. Please try again."
        }
      })
    }
  })
  