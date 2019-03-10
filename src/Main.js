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

// Global variables
var inputWords, textOutput;

// Force scrolling to top on refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function clearSearchResults() {
    $("#text-output").empty();
    $("#sidebar-results").empty();
    $("#userInput").val('');
    $("#userInput").placeholder = "We will make your text more inclusive!";
    $('.replace-btn').prop('disabled', false);
    $('.copy-btn').prop('disabled', true);
}

function processInput() {
    let inputText = document.getElementById("userInput").value;
    console.log("Input: " + inputText + "\n");
    inputWords = parse(inputText);
    let offWords = detectOffensiveWords(inputWords);
    if (offWords.length > 0) {
        createExplanationAndSuggestionBlocks(offWords);
        textOutput = "<p>" + highlightWords(offWords, inputWords) + "</p>";
    } else {
        let root = document.getElementById("sidebar-results");
        let noOffWordsText = "Awesome, your text is already inclusive!";
        let noOffWordsTextNode = document.createTextNode(noOffWordsText);
        root.appendChild(noOffWordsTextNode);
        textOutput = "<p>Great job! Your text seems to be pretty friendly :)</p>";
    }
    $("#text-output").append(textOutput);

    // Enable popovers
    $(function () {
        $('[data-toggle="popover"]').popover();
        $('[data-toggle="tooltip"]').tooltip();
    });
}

function toggleResults() {
    $(".sidebar").toggleClass("w-30");
    $(".main-page").toggleClass("w-70");
}

function goToResults() {
    window.scrollTo(0, document.body.scrollHeight);
}

function goToSearch() {
    clearSearchResults();
    window.scrollTo(0, 0);
}

// Returns an array of words without punctuation at the start and end of strings
function parse(input) {
  let wordsAndPunctuation = splitWordsAndPunctuation(input);
  return wordsAndPunctuation;
}

function splitWordsAndPunctuation(input) {
    return input.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').split(' ');
}

function joinWordsAndPunctuation(processedWords) {
    let finalStr = "";
    for (let i=0; i<processedWords.length; i++) {
        // only checks if there's a punctuation mark after a word
        let checkPuncIndex = i + 1;
        if ((checkPuncIndex < processedWords.length) &&
        (processedWords[checkPuncIndex] === "," ||
        processedWords[checkPuncIndex] === "." ||
        processedWords[checkPuncIndex] === "?" ||
        processedWords[checkPuncIndex] === "!")) {
            finalStr = finalStr.concat(" " + processedWords[i], processedWords[checkPuncIndex]);
            ++i;
        } else {
            finalStr = finalStr.concat(" ", processedWords[i]);
        }
    }
    return finalStr;
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

function getReplacements(word) {
    if (offensiveWords.hasOwnProperty(word)) {
        const index = offensiveWords[word][1];
        return replacements[index];
    }

    return null;
}

/*
    Returns a string to display suggested replacements for an offensive word
*/
function getSuggestionText(word) {
    const wordReplacements = getReplacements(word);
  if (wordReplacements) {
    return "Try using these more inclusive terms instead: <br>" + wordReplacements.join(", ");
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

  const processedInput = originalOutput.map((word, i) => {
    if (indexes.includes(i)) {
        const content = getSuggestionText(word);
        return '<mark data-toggle="popover" data-html="true"  data-trigger="hover" data-content="' + content + '">' + word + '</mark>';
    }

    return word;
  });

  return joinWordsAndPunctuation(processedInput);
}

function copyToClipboard() {
    // Source: https://stackoverflow.com/questions/5002111/how-to-strip-html-tags-from-string-in-javascript
    const selectedText = textOutput.replace(/<\/?[^>]+(>|$)/g, "");
    console.log(selectedText);
    const el = document.createElement('textarea');
    el.value = selectedText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function autoReplace() {
    let offWords = detectOffensiveWords(inputWords);

    let newWords = inputWords.map(word => {
        if (offWords.includes(word)) {
            return getReplacements(word)[0];
        }

        return word;
    });

    textOutput = "<p>" + newWords.join(" ") + "</p>"; 

    $("#text-output").empty();
    $("#text-output").append(textOutput);

    $('.replace-btn').tooltip('hide');
    $('.replace-btn').prop('disabled', true);
    $('.copy-btn').prop('disabled', false);
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
//const textOutput = "<p>" + highlightWords(offWords, parsedOutput) + "</p>";
//$("#text-output").append(textOutput);
console.log(highlightWords(offWords, parsedOutput));

// Tests for offensive word detection
let testOffensiveWords = detectOffensiveWords(parsedOutput);
console.log(testOffensiveWords);
console.log(getExplanation("bossy"));
console.log(getSuggestionText("bossy"));

// Tests for creating explanation and suggestions text blocks
// let htmlExplanationSuggBlocks = createExplanationAndSuggestionBlocks(testOffensiveWords);
// console.log(htmlExplanationSuggBlocks);
