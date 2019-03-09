const offensiveWords = {
    "bossy": [0, 0],
    "guys": [1, 1],
    "manpower": [1, 2],
    "his": [1, 3]
};

const explanations = [
    "This term might be seen as offensive to women. Typically, this adheres to a stereotype used to describe women negatively.",
    "This term uses gendered language that may insinuate that men are a preferred gender.",
];

const replacements = [
    ["assertive", "strict"],
    ["folks", "everyone", "team", "y'all"],
    ["workforce", "workers", "team"],
    ["their", "theirs", "one's"]
];