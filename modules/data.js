var fs = require('fs');
var _ = require('underscore');
var marked = require('marked');

var getPosts = function (config) {
    'use strict';

    config.posts = [];

    var directory = fs.readdirSync(config.path.posts);

    directory.forEach(function (file) {
        var filetype = file.substr(-('.md').length);

        if (filetype === '.md') {
            config.posts.push({
                filename: file.replace('.md', '')
            });
        }
    });

    console.log('  ✔ posts loaded');
};

var getMetadata = function (config) {
    'use strict';

    config.posts.forEach(function (post) {
        var metadataFile = fs.readFileSync(config.path.posts + post.filename + '.json', 'utf8');

        var metadata = JSON.parse(metadataFile);

        metadata.extension = '.md';
        post = _.extend(post, metadata);
    });

    console.log('  ✔ metadata loaded');
};

var getContent = function (config) {
    'use strict';

    config.posts.forEach(function (post) {
        var postContent = fs.readFileSync(config.path.posts + post.filename + post.extension, 'utf8');
        post.content = postContent;
    });

    console.log('  ✔ content loaded');
};

var getTitles = function (config) {
    'use strict';

    config.posts.forEach(function (post) {
        var tokens = marked.lexer(post.content);

        tokens.forEach(function (token) {
            if (token.type === 'heading' && token.depth === 1) {
                post.title = token.text;
            }
        });
    });

    console.log('  ✔ titles loaded');
};

var getCategories = function (config) {
    'use strict';

    var categories = [];
    config.posts.forEach(function (post) {
        post.categories.forEach(function (category) {
            categories.push(category);
        });
    });

    config.categories = _.uniq(categories);

    console.log('  ✔ categories loaded');
};

var generateData = function (config) {
    'use strict';

    getPosts(config);
    getMetadata(config);
    getContent(config);
    getTitles(config);
    getCategories(config);
};

exports = module.exports = generateData;
