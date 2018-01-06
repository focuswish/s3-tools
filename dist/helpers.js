"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uppercase = str => str.charAt(0).toUpperCase() + str.slice(1);
exports.capKeys = (obj) => Object.keys(obj)
    .reduce((acc, key) => {
    acc[exports.uppercase(key)] = obj[key];
    return acc;
}, {});
exports.createTagSet = (data) => {
    const tags = Object.keys(data).map(key => `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`);
    return `<Tagging><TagSet>${tags.join('')}</TagSet></Tagging>`;
};
//# sourceMappingURL=helpers.js.map