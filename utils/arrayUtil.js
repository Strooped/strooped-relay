
/**
 * Shuffles array in place. ES6 version
 * @param {Array} array items An array containing the items.
 */
function shuffle(array) {
  const updatedArray = array.concat([]);

  // eslint-disable-next-line no-plusplus
  for (let i = updatedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [updatedArray[i], updatedArray[j]] = [updatedArray[j], updatedArray[i]];
  }
  return updatedArray;
}

module.exports = { shuffle };
