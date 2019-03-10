let constants = require("./constants");
const { offensiveWords, explanations, replacements } = constants;

/** Main functionality for inclusive-language text checker */

let example = "I will print all these bossy ,words and n0mber-5, shesaid!";

function parse(input) {
  // split input: string by spaces
  let wordsWithoutSpace = input.split(" ");

  // remove punctuation from word
  let cleansedWords = removePunctuationFrom(wordsWithoutSpace);
  return wordsWithoutSpace;
}

function removePunctuationFrom(words) {
  let result = [];
  words.forEach(word => {
    word.split(/\b/);
  });
  return result;
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

let parsedOutput = parse(example);
parsedOutput.forEach(word => console.log(word));
console.log(detectOffensiveWords(parsedOutput));
console.log(getExplanation("bossy"));
console.log(getSuggestionText("bossy"));
