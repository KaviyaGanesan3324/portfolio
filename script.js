/* ============================
   SCROLL FRAME ANIMATION
============================ */

const canvas = document.getElementById("frameCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 240;
const images = [];
const imageSeq = {
  frame: 0
};

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  const frameNumber = String(i).padStart(3, '0');
  img.src = `frames/ezgif-frame-${frameNumber}.jpg`;
  images.push(img);
}

images[0].onload = function() {
  context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
};

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
});

/* ============================
   GEMINI CHATBOT
============================ */

const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // replace this

const STRICT_SYSTEM_PROMPT = `
You are a resume assistant.
You MUST answer ONLY using the information present in the uploaded resume PDF of G. Kaviya.
Do NOT generate any additional information.
If the question is not related to the resume content, reply:
"I can only answer questions related to the uploaded resume."
Keep answers concise and professional.
`;

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");
  const userText = input.value;

  if (!userText) return;

  chatBody.innerHTML += `<div><strong>You:</strong> ${userText}</div>`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: STRICT_SYSTEM_PROMPT + "\n\nUser Question: " + userText
          }]
        }]
      })
    }
  );

  const data = await response.json();
  const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text 
                   || "Error retrieving response.";

  chatBody.innerHTML += `<div><strong>Assistant:</strong> ${botReply}</div>`;
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
}
