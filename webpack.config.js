const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        sun: './src/sun/sun.js',
        moon: './src/moon/moon.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
};
