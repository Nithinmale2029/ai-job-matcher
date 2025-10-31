document.getElementById("matchBtn").addEventListener("click", () => {
  const resume = document.getElementById("resume").value.toLowerCase();
  const job = document.getElementById("job").value.toLowerCase();

  if (!resume || !job) {
    document.getElementById("result").innerText = "Please enter both fields.";
    return;
  }

  // Basic keyword matching
  const resumeWords = new Set(resume.split(/\W+/));
  const jobWords = new Set(job.split(/\W+/));

  const commonWords = [...jobWords].filter(word => resumeWords.has(word));
  const score = ((commonWords.length / jobWords.size) * 100).toFixed(1);

  document.getElementById("result").innerText = 
    `Match Score: ${score}% (${commonWords.length} overlapping keywords found)`;
});
