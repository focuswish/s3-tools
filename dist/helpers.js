"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uppercase = str => str.charAt(0).toUpperCase() + str.slice(1);
exports.capitalize = (obj) => Object.keys(obj)
    .reduce((acc, key) => {
    acc[exports.uppercase(key)] = obj[key];
    return acc;
}, {});
//# sourceMappingURL=helpers.js.map