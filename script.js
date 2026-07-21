async function guessAnswer() {
  let question = document.getElementById("question").value.trim();

  let options = [
    document.getElementById("a").value.trim(),
    document.getElementById("b").value.trim(),
    document.getElementById("c").value.trim(),
    document.getElementById("d").value.trim()
  ];

  let resultBox = document.getElementById("result");

  if (!question || options.some(opt => opt === "")) {
    resultBox.innerHTML = "⚠️ Please enter question and all 4 options";
    return;
  }

  resultBox.innerHTML = "🤖 Thinking...";

  const prompt = `
Question: ${question}

Options:
A. ${options[0]}
B. ${options[1]}
C. ${options[2]}
D. ${options[3]}

Choose the most likely correct answer.

Reply ONLY in this format:
Answer: <option>
Confidence: <number>%
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyAvR4EXEooRfO5uTmVs63m2pPyfvMs2zas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("API RESPONSE:", data);

    if (!response.ok) {
      resultBox.innerHTML =
        "❌ Gemini API Error: " + (data.error?.message || "Unknown error");
      return;
    }

    let text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    resultBox.innerHTML = `<pre>${text}</pre>`;
    addHistory(question, text);

  } catch (error) {
    console.error(error);
    resultBox.innerHTML = "❌ Error calling Gemini API";
  }
}

function addHistory(question, answer) {
  let historyList = document.getElementById("historyList");
  let li = document.createElement("li");
  li.innerHTML = `Q: ${question}<br>${answer}`;
  historyList.appendChild(li);
}

function clearAll() {
  document.getElementById("question").value = "";
  document.getElementById("a").value = "";
  document.getElementById("b").value = "";
  document.getElementById("c").value = "";
  document.getElementById("d").value = "";
  document.getElementById("result").innerHTML = "";
}