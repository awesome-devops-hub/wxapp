const config = require('../../../../components/towxml/config'),
    hljs = require('./highlight');
config.highlight.forEach(item => {
    hljs.registerLanguage(item, require(`./languages/${item}`).default);
});

module.exports = hljs;
