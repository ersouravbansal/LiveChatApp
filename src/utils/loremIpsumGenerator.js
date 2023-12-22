// src/utils/loremIpsumGenerator.js
const { loremIpsum } = require('lorem-ipsum');

const Names = ['Aarav', 'Ishaan', 'Aanya', 'Sanya', 'Rohan', 'Aaradhya', 'Ananya', 'Aryan', 'Aishwarya', 'Rahul'];

const generateName = () => {
  const randomIndex = Math.floor(Math.random() * Names.length);
  return Names[randomIndex];
};

const generateLoremIpsum = () => {
  return loremIpsum({
    count: 1,
    units: 'sentences',
    sentenceLowerBound: 5,
    sentenceUpperBound: 15,
    paragraphLowerBound: 3,
    paragraphUpperBound: 7,
    format: 'plain',
  });
};

module.exports = { generateName, generateLoremIpsum };
