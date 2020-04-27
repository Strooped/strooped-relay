const { shuffle } = require('./arrayUtil');
const Task = require('../model/task');
const TaskType = require('../model/enum/taskTypes');

/**
 * Returns a random selection of colors of {count} size
 * */
const getRandomSelection = (count, colorList) => {
  const taken = new Set();

  return new Array(count)
    .fill(null)
    .map(() => {
      let [color] = shuffle(colorList);

      // Prevent us from selecting the same item twice
      if (taken.has(color.color)) {
        [color] = shuffle(colorList);
      }

      taken.add(color.color);

      return color;
    });
};

const buildColorTask = (colorList) => {
  const buttons = getRandomSelection(4, colorList)
    .map(({ color }) => color);

  return new Task({
    buttons,
    type: TaskType.COLOR,
    correctAnswer: shuffle(buttons)[0]
  });
};


module.exports = { getRandomSelection, buildColorTask };
