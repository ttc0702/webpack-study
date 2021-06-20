module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parser": 'babel-eslint',
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": 'module'
  },
  "settings": {
		"react": { "version": "detect" }
	},
  "plugins": [
    "react"
  ],
  "globals": {
    // document 作为全局变量不允许被覆盖
    "document": false
  },
  "rules": {
    'no-undef': 0,
		'no-debugger': 0
  }
};
