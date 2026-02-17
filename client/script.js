let currentImageUrl = null;

async function generateImage() {
  const promptInput = document.getElementById("promptInput");
  const prompt = promptInput.value.trim();
  const imageBox = document.getElementById("imageBox");
  const downloadSection = document.getElementById("downloadSection");

  if (!prompt) {
    alert("Please enter a prompt!");
    return;
  }

  // Show loader and disable input
  imageBox.innerHTML = '<div class="loader"></div>';
  downloadSection.style.display = "none";
  promptInput.disabled = true;

  try {
    const response = await fetch("http://localhost:5000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    // Handle non-JSON error responses
    if (!response.ok) {
      let errorMessage = "Server Error";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    }

    const blob = await response.blob();

    // Revoke previous URL to prevent memory leaks
    if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
    currentImageUrl = URL.createObjectURL(blob);

    // Show generated image
    imageBox.innerHTML = `<img src="${currentImageUrl}" alt="Generated Image"/>`;
    downloadSection.style.display = "block";

  } catch (error) {
    imageBox.innerHTML = `<p style="color:red;">${error.message}</p>`;
  } finally {
    promptInput.disabled = false;
  }
}

function downloadImage() {
  if (!currentImageUrl) return;

  const a = document.createElement("a");
  a.href = currentImageUrl;
  a.download = "ai-generated-image.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
