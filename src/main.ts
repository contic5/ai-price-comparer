  
async function askOpenAI() {
  const result = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  const data = await result.json();
  const response=data.response;
  alert(response);
}

let prompt="How are you today?";
askOpenAI();