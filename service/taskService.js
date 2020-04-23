const taskService = {
  checkAnswer: (answer, room, player) => {
    const task = room.getCurrentTask();
    if (task.correctAnswer === answer) {
      player.increment('score');
    }
  }
};

module.exports = taskService;
