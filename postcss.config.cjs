const postcssNesting = require('postcss-nesting');

module.exports = {
    map: true,
    plugins: [
        postcssNesting( {} ),
    ],
};
