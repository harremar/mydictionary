// Import dotenv config
import config from "./config.js";
document.addEventListener("DOMContentLoaded", async function () {
  // Function to fetch word of the day
  const fetchWordOfTheDay = async () => {
    const url = "https://urban-dictionary7.p.rapidapi.com/v0/words_of_the_day";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": config.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "urban-dictionary7.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch word of the day");
      }
      const data = await response.json();
      return data.list[0];
    } catch (error) {
      console.error("Error fetching word of the day:", error);
      return null;
    }
  };

  // Function to fetch word definition by term
  const fetchWordDefinition = async (term) => {
    const url = `https://urban-dictionary7.p.rapidapi.com/v0/define?term=${term}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": config.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "urban-dictionary7.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch word definition");
      }
      const data = await response.json();
      return data.list[0];
    } catch (error) {
      console.error("Error fetching word definition:", error);
      return null;
    }
  };

  // Function to display word
  const displayWord = (wordData) => {
    if (!wordData) {
      return;
    }

    const wordheading = document.getElementById("wordheading");
    const definition = document.getElementById("definition");
    const example = document.getElementById("example");

    wordheading.textContent = wordData.word;
    definition.innerHTML = parseDefinition(wordData.definition);
    example.innerHTML = parseDefinition(wordData.example);
  };

  const parseDefinition = (text) => {
    // Regular expression to find words in square brackets
    const wordRegex = /\[(.*?)\]/g;
    let parsedText = text;

    // Replace words in square brackets with clickable links
    parsedText = parsedText.replace(wordRegex, (match, word) => {
      return `<a href="#" class="word-link">${word}</a>`;
    });

    return parsedText;
  };

  // Fetch word of the day and display it
  const loadWordOfTheDay = async () => {
    const wordOfTheDay = await fetchWordOfTheDay();
    displayWord(wordOfTheDay);
  };

  // Initial load of word of the day
  loadWordOfTheDay();

  // Search form functionality
  const searchForm = document.getElementById("searchForm");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("searchinput").value.trim();
    if (searchInput === "") {
      return;
    }

    const wordData = await fetchWordDefinition(searchInput);
    displayWord(wordData);
  });

  // Random word functionality
  const randomWordLink = document.getElementById("randomWordLink");

  randomWordLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const randomWordData = await fetchRandomWord();
    displayWord(randomWordData);
  });

  // Word of the Day link functionality
  const wordOfTheDayLink = document.getElementById("wordOfTheDayLink");

  wordOfTheDayLink.addEventListener("click", async (e) => {
    e.preventDefault();
    loadWordOfTheDay();
  });

  // Function to fetch random word
  const fetchRandomWord = async () => {
    const url = "https://urban-dictionary7.p.rapidapi.com/v0/random";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": config.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "urban-dictionary7.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch random word");
      }
      const data = await response.json();
      return data.list[0];
    } catch (error) {
      console.error("Error fetching random word:", error);
      return null;
    }
  };

  // Event listener for word links
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("word-link")) {
      e.preventDefault();
      const term = e.target.textContent;
      const wordData = await fetchWordDefinition(term);
      displayWord(wordData);
    }
  });
});
