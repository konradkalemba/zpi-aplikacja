export const minSimilarity = 0.2

export const streetPrefs = [
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
]

export function filterWordsForStreet(w: Array<string>): Array<string> {
    let arr = new Array();
    for (var i = 0; i < w.length; i++) {
        for (var j = 0; j < streetPrefs.length; j++) {
            if (w[i].includes(streetPrefs[j]) && w.length > i) {
                arr.push(w[i + 1])
            }
        }
    }
    return arr;
}