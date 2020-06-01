module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    env: {
        "browser": true,
        "node": true
    },
    globals: {
        "appTool": true,
        "require": true,
        "$": true,
        "ant": true
    },
    rules: {
        "semi": ["error", "always"],
        "quotes": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-unused-vars": "off",
    }
};
