// Filename: app.js

const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

// Generates a random date between June 16, 1995 and today
function getRandomDate() {
  const start = new Date("1995-06-16"); // NASA APOD start date
  const end = new Date(); // Current date
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);

  // Format the date as YYYY-MM-DD
  const yyyy = randomDate.getFullYear();
  const mm = String(randomDate.getMonth() + 1).padStart(2, "0");
  const dd = String(randomDate.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

// Main route that renders the homepage
app.get("/", async (req, res) => {
  const randomDate = getRandomDate(); // Get a random date
  const nasaURL = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randomDate}`; // NASA APOD API
  const messageAPI = "https://zenquotes.io/api/random"; // Random inspirational quote API

  try {
    // Fetch both NASA image and quote in parallel
    // Note:
    // If the NASA image does not load, it's likely due to the free API rate limit.
    const [nasaRes, quoteRes] = await Promise.all([
      fetch(nasaURL),
      fetch(messageAPI),
    ]);

    const nasaData = await nasaRes.json();
    console.log("NASA API Response:", nasaData); // Log for debugging
    const quoteData = await quoteRes.json();
    const quote = `"${quoteData[0].q}" — ${quoteData[0].a}`; // Format the quote

    res.render("index", {
      title: nasaData.title,
      imageURL: nasaData.url,
      greeting: quote,
    });
  } catch (error) {
    console.error("Error fetching APIs:", error);
    res.render("index", {
      title: "Error loading data",
      imageURL: "",
      greeting: "Hello! The quote API is down, but you're still amazing.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});