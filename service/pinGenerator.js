const pinGeneratorService = {
  generate: () => Math.round(Math.random() * (1000000 - 1) + 1)
};

module.exports = pinGeneratorService;
