let constants = require('./constants');

/** Main functionality for inclusive-language text checker */

let example = "I will print all these ,words and n0mber-5, shesaid!"

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
    })
    return result;
}

let parsedOutput = parse(example);
parsedOutput.forEach(word => console.log(word));
console.log(constants.offensiveWords);