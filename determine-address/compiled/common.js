"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minSimilarity = 0.2;
exports.streetPrefs = [
    "ul.",
    "ulic",
    "skrzyżow",
    "al.",
    "alej",
    "alei",
    "rond",
    "pl.",
    "plac",
    "most",
    "skwer",
    "bulwar"
];
function filterWordsForStreet(w) {
    var arr = new Array();
    for (var i = 0; i < w.length; i++) {
        for (var j = 0; j < exports.streetPrefs.length; j++) {
            if (w[i].includes(exports.streetPrefs[j]) && w.length > i) {
                arr.push(w[i + 1]);
            }
        }
    }
    return arr;
}
exports.filterWordsForStreet = filterWordsForStreet;
