let resumeText = "";

document.getElementById("resume").addEventListener("change", async function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const fileType = file.name.split('.').pop().toLowerCase();

  if (fileType === "pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      text += strings.join(" ") + " ";
    }
    resumeText = text.toLowerCase();
  } else if (fileType === "docx") {
    const reader = new FileReader();
    reader.onload = async function(event) {
      const arrayBuffer = event.target.result;
      const result = await mammoth.extractRawText({ arrayBuffer });
      resumeText = result.value.toLowerCase();
    };
    reader.readAsArrayBuffer(file);
  } else if (fileType === "txt") {
    const reader = new FileReader();
    reader.onload = function(event) {
      resumeText = event.target.result.toLowerCase();
    };
    reader.readAsText(file);
  } else {
    alert("Unsupported file type. Please upload PDF, DOCX, or TXT.");
  }
});

document.getElementById("matchBtn").addEventListener("click", function() {
  const job = document.getElementById("job").value.toLowerCase();
  if (!resumeText) return alert("Please upload your resume first.");
  if (!job) return alert("Please paste a job description.");

  const resumeWords = new Set(resumeText.split(/\W+/));
  const jobWords = new Set(job.split(/\W+/));

  const commonWords = [...jobWords].filter(word => resumeWords.has(word));
  const missingWords = [...jobWords].filter(word => !resumeWords.has(word));

  const score = ((commonWords.length / jobWords.size) * 100).toFixed(1);

  // Animate score bar
  const scoreBar = document.getElementById("scoreBar");
  scoreBar.style.width = `${score}%`;
  scoreBar.textContent = `${score}%`;

  // Show textual result
  document.getElementById("result").innerText =
    `🎯 Match Score: ${score}% (${commonWords.length} matching keywords)`;

  // Show top missing keywords
  const topMissing = missingWords.slice(0, 10);
  document.getElementById("keywords").innerHTML =
    topMissing.length > 0 
      ? `💡 Consider adding these keywords to your resume: <strong>${topMissing.join(', ')}</strong>` 
      : "✅ Great! Your resume already contains most keywords!";
});
