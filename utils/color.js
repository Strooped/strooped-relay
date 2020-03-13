const allColors = require('../public/colors.json');
const { shuffle } = require('./arrayUtil');

/**
 * Returns a random selection of colors of {count} size
 * */
const getRandomSelection = (count) => {
  const taken = new Set();

  return new Array(count)
    .fill(null)
    .map(() => {
      let [color] = shuffle(allColors);

      // Prevent us from selecting the same item twice
      if (taken.has(color.color)) {
        [color] = shuffle(allColors);
      }

      taken.add(color.color);

      return color;
    });
};

module.exports = { getRandomSelection };
