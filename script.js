const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}
// Hide Loading

function removeLoadingSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}
// Get Quote From API
async function getQuote(retries=10) {
  showLoadingSpinner();
  const proxyUrl = "https://powerful-thicket-29590.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
  
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    // if Author is blank, add 'Unknown'
    if (data.quoteAuthor === "") {
      authorText.innerText = "Unknown";
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // Reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }
    quoteText.innerText = data.quoteText;
    // Stop loader, Show result
    removeLoadingSpinner();
  } catch (error) {
    if (retries > 0) {
      console.log('i retried it')
      return getQuote(retries - 1);
    } else {
      authorText.innerText = "something went wrong";
      quoteText.innerText = "something went wrong";
      removeLoadingSpinner();
      throw new Error("it is not going to work this time.");
    }
  }
}


function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

// Event Listeners
newQuoteBtn.addEventListener("click", function() {getQuote()});
twitterBtn.addEventListener("click", tweetQuote);
// On Load
getQuote();
