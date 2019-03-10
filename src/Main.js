// let constants = require(["./constants"], constants => {
//   console.log("declaring constants\n");
//   return constants;
// });

/** Main functionality for inclusive-language text checker */

// Constants
const offensiveWords = {
  bossy: [0, 0],
  guys: [1, 1],
  manpower: [1, 2],
  his: [1, 3],
  waiter: [2,4],
  waitress: [2, 4],
  chairman: [1, 5],
  wife: [3, 6],
  husband: [3, 6],
  mom: [3, 7],
  dad: [3, 7],
  elderly: [4, 8]
};

const explanations = [
  "This term might be seen as offensive to women. Typically, this adheres to a stereotype used to describe women negatively.",
  "This term uses gendered language that may insinuate that men are a preferred gender.",
  "This term uses unnecessary gendered language to describe an occupation. It may be helpful to describe the work, not the gender.",
  "This term uses language that dismisses different types of family structures.",
  "This term could be more specific to avoid assuming stereotypes of an age group. Try focusing on a quality of the group that you're trying to address."
];

const replacements = [
  ["assertive", "strict"],
  ["folks", "everyone", "team", "y'all"],
  ["workforce", "workers", "team"],
  ["their", "theirs", "one's"],
  ["server", "waitstaff"],
  ["chairperson", "chair", "director", "leader"],
  ["spouse", "partner"],
  ["parent", "guardian", "caregiver"],
  ["grandparents", "people on fixed incomes"]
];

function processInput() {
    let input = document.getElementById("userInput").value;
    let allWords = parse(input);
    let offWords = detectOffensiveWords(allWords);
    createExplanationAndSuggestionBlocks(offWords);
    const textOutput = "<p>" + highlightWords(offWords, allWords) + "</p>";
    $(".text-output").append(textOutput);
}

function toggleResults() {
    $(".sidebar").toggleClass("w-30");
    $(".main-page").toggleClass("w-70");
}

function goToResults() {
    window.scrollTo(0, document.body.scrollHeight)
}

function goToSearch() {
    window.scrollTo(0, 0)
}

// Returns an array of words without punctuation at the start and end of strings
function parse(input) {
  let wordsWithoutPunctuation = removePunctuation(input);
  let wordsSplitBySpaces = wordsWithoutPunctuation.split(" ");
  let finalWords = removeEmptyStrings(wordsSplitBySpaces);
  return finalWords;
}

function removePunctuation(input) {
  return input.replace(
    /\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g,
    ""
  );
}

function removeEmptyStrings(input) {
  return input.filter(word => word !== "");
}

function createExplanationAndSuggestionBlocks(input) {
    let root = document.getElementById("sidebar-results");

    input.forEach(word => {
        // create card to store offensive word info
        let card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("card-body");
        card.classList.add("bg-light");

        // create header
        let headerText = document.createTextNode(word);
        let headerNode = document.createElement("h4");
        headerNode.appendChild(headerText);
        card.appendChild(headerNode);

        // create explanation paragraph
        let explanation = getExplanation(word);
        let explanationIntro = "Why might we want to use another word? ";
        let explanationText = document.createTextNode(explanationIntro + explanation);
        let explanationNode = document.createElement("p");
        explanationNode.appendChild(explanationText);
        card.appendChild(explanationNode);

        // create suggestions paragraph
        let suggestion = getSuggestionText(word);
        let suggestionText = document.createTextNode(suggestion);
        let suggestionNode = document.createElement("p");
        suggestionNode.appendChild(suggestionText);
        card.appendChild(suggestionNode);

        root.appendChild(card);
    });
}

/*
    Returns an array of offensive words
*/
function detectOffensiveWords(allWords) {
  const detectedWords = [];

  allWords.forEach(word => {
    if (offensiveWords.hasOwnProperty(word)) {
      detectedWords.push(word);
    }
  });

  return detectedWords;
}

/*
    Returns a string of the explanation for why a word is offensive
*/
function getExplanation(word) {
  if (offensiveWords.hasOwnProperty(word)) {
    const index = offensiveWords[word][0];
    return explanations[index];
  }

  return "";
}

/*
    Returns a string to display suggested replacements for an offensive word
*/
function getSuggestionText(word) {
  if (offensiveWords.hasOwnProperty(word)) {
    const index = offensiveWords[word][1];
    const suggestedReplacements = replacements[index];

    return (
      "Try using these more inclusive terms instead:\n" +
      suggestedReplacements.join(", ")
    );
  }

  return "";
}

/*
    Returns the final block of text with offensive words highlighted

    @param offensiveWords {Array}
    @param originalOutput {Array}
*/
function highlightWords(offensiveWords, originalOutput) {
  const indexes = [];

  offensiveWords.forEach(word => {
    let index = originalOutput.indexOf(word);
    while (index != -1) {
      indexes.push(index);
      index = originalOutput.indexOf(word, index + 1);
    }
  });

  const processedWords = originalOutput.map((word, i) => {
    if (indexes.includes(i)) {
      return '<mark>' + word + "</mark>";
    }

    return word;
  });

  return processedWords.join(" ");
}

// Tests for parse
let example = "I will print all these bossy ,words and n0mber-5, shesaid!";
let example2 = ".wrods!";
let example3 = " y.   use";

let parsedOutput = parse(example);
let parsedOutput2 = parse(example2);
let parsedOutput3 = parse(example3);
// console.log(parsedOutput);
// console.log(parsedOutput2);
// console.log(parsedOutput3);
// parsedOutput.forEach(word => console.log(word));

let offWords = detectOffensiveWords(parsedOutput);
const textOutput = "<p>" + highlightWords(offWords, parsedOutput) + "</p>";
//$(".text-output").append(textOutput);
console.log(highlightWords(offWords, parsedOutput));

// Tests for offensive word detection
let testOffensiveWords = detectOffensiveWords(parsedOutput);
console.log(testOffensiveWords);
console.log(getExplanation("bossy"));
console.log(getSuggestionText("bossy"));

// Tests for creating explanation and suggestions text blocks
let htmlExplanationSuggBlocks = createExplanationAndSuggestionBlocks(testOffensiveWords);
console.log(htmlExplanationSuggBlocks);
