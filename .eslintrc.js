

module.exports = {
  "parserOptions": {
    "ecmaVersion": 8
  },
  "env": {
    "es6": true,
    "node": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "max-len": [
      "error",
      100,
      2,
      {
        "ignoreUrls": true,
        "ignoreComments": false,
        "ignoreRegExpLiterals": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true
      }
    ],
    "no-console": [
      "error",
      {
        "allow": ["warn", "error", "info"]
      }
    ]
  }
};
