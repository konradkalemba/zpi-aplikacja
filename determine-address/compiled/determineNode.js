"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("./pg");
var address_1 = require("./address");
var common_1 = require("./common");
var Lev = require('js-levenshtein');
function determineNode(q) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = address_1.Address.bind;
                    return [4 /*yield*/, determineDistrict(q.district)];
                case 1:
                    _b = [void 0, _c.sent()];
                    return [4 /*yield*/, determineStreet(q.description)];
                case 2: return [2 /*return*/, new (_a.apply(address_1.Address, _b.concat([_c.sent()])))()];
            }
        });
    });
}
exports.determineNode = determineNode;
function determineStreet(description, city) {
    if (city === void 0) { city = 'Wrocław'; }
    return __awaiter(this, void 0, void 0, function () {
        var results, words, streets, minLev, street, i, j, l;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = new Array();
                    words = description.split(/\s+/);
                    words = common_1.filterWordsForStreet(words);
                    return [4 /*yield*/, pg_1.pool.query("\n\n            select u.nazwa, u.id_teryt\n            from ulice u \n            inner join miasta m on m.id_teryt = u.miasto_id_teryt\n            where m.nazwa = $1;\n\n        ", [city])];
                case 1:
                    streets = _a.sent();
                    minLev = 5000000;
                    street = null;
                    for (i = 0; i < words.length; i++) {
                        for (j = 0; j < streets.rowCount; j++) {
                            l = Lev(streets.rows[j].nazwa, words[i]);
                            if (l < minLev) {
                                minLev = l;
                                street = new address_1.Street(streets.rows[j].id_teryt, streets.rows[j].nazwa);
                            }
                        }
                    }
                    return [2 /*return*/, street];
            }
        });
    });
}
function determineDistrict(district, city) {
    if (city === void 0) { city = 'Wrocław'; }
    return __awaiter(this, void 0, void 0, function () {
        var res, minLev, distr, j, l;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pg_1.pool.query("\n\n        select d.id_teryt, d.nazwa\n        from dzielnice d \n        inner join miasta m on m.id_teryt = d.miasto_id_teryt\n        where m.nazwa = $1;\n       \n        ", [city])];
                case 1:
                    res = _a.sent();
                    minLev = 5000000;
                    distr = null;
                    for (j = 0; j < res.rowCount; j++) {
                        l = Lev(res.rows[j].nazwa, district);
                        if (l < minLev) {
                            minLev = l;
                            distr = new address_1.District(res.rows[j].id_teryt, res.rows[j].nazwa);
                        }
                    }
                    return [2 /*return*/, distr];
            }
        });
    });
}
