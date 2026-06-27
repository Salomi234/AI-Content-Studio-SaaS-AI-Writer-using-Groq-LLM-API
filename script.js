const API_KEY = "PUT_API_KEY";

async function generateContent() {
  const type = document.getElementById("type").value;
  const tone = document.getElementById("tone").value;
  const topic = document.getElementById("topic").value;

  const output = document.getElementById("output");
  const status = document.getElementById("status");
  const counter = document.getElementById("counter");

  if (!topic) {
    status.innerText = "⚠️ Enter a topic";
    return;
  }

  status.innerText = "🤖 AI is thinking...";
  output.innerText = "Generating...";

  const prompt = `Write a ${tone} ${type} about "${topic}"`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    const result = data?.choices?.[0]?.message?.content;

    if (!result) {
      output.innerText = "❌ No response from AI";
      status.innerText = "❌ Failed";
      return;
    }

    output.innerText = result;
    status.innerText = "✅ Done";

    updateCounter(result);
    addHistory(result);

  } catch (err) {
    output.innerText = "❌ Error calling API";
    status.innerText = "❌ Failed";
  }
}

/* COPY */
function copyText() {
  navigator.clipboard.writeText(document.getElementById("output").innerText);
  document.getElementById("status").innerText = "📋 Copied!";
}

/* CLEAR */
function clearOutput() {
  document.getElementById("output").innerText = "";
  document.getElementById("counter").innerText = "Words: 0";
}

/* WORD COUNT */
function updateCounter(text) {
  const words = text.trim().split(/\s+/).length;
  document.getElementById("counter").innerText = "Words: " + words;
}

/* HISTORY */
function addHistory(text) {
  const div = document.createElement("div");
  div.className = "history-item";
  div.innerText = text.slice(0, 80) + "...";

  div.onclick = () => {
    document.getElementById("output").innerText = text;
    updateCounter(text);
  };

  document.getElementById("historyList").prepend(div);
}

/* PROMPT SHORTCUT */
function fillPrompt(text) {
  document.getElementById("topic").value = text;
}