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
function determinePg(q) {
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
exports.determinePg = determinePg;
function determineStreet(description, city) {
    if (city === void 0) { city = 'Wrocław'; }
    return __awaiter(this, void 0, void 0, function () {
        var results, words, i, r, row, sorted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = new Array();
                    words = description.split(/\s+/);
                    words = common_1.filterWordsForStreet(words);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < words.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, pg_1.pool.query("\n\n            select u.id_teryt, u.nazwa, similarity(u.nazwa, $1) as sim\n            from ulice u \n            inner join miasta m on m.id_teryt = u.miasto_id_teryt\n            where m.nazwa = $2\n            order by similarity(u.nazwa, $1) desc\n            limit 1;\n\n        ", [words[i], city])];
                case 2:
                    r = _a.sent();
                    row = r.rows[0];
                    if (row.sim > common_1.minSimilarity) {
                        results.push({
                            sim: row.sim,
                            idTeryt: row.id_teryt,
                            nazwa: row.nazwa
                        });
                    }
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    sorted = results.sort(function (r1, r2) { return r2.sim > r1.sim ? 1 : (r2.sim == r1.sim ? 0 : -1); });
                    if (sorted.length > 0)
                        return [2 /*return*/, new address_1.Street(sorted[0].idTeryt, sorted[0].nazwa)];
                    else
                        return [2 /*return*/, null];
                    return [2 /*return*/];
            }
        });
    });
}
function determineDistrict(district, city) {
    if (city === void 0) { city = 'Wrocław'; }
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pg_1.pool.query("\n\n        select d.id_teryt, d.nazwa, similarity(d.nazwa, $1) as sim\n        from dzielnice d \n        inner join miasta m on m.id_teryt = d.miasto_id_teryt\n        where m.nazwa = $2\n        order by similarity(d.nazwa, $1) desc\n        limit 1;", [district, city])];
                case 1:
                    res = _a.sent();
                    if (res.rows[0].similarity < common_1.minSimilarity)
                        return [2 /*return*/, null];
                    else {
                        return [2 /*return*/, new address_1.District(res.rows[0].id_teryt, res.rows[0].nazwa)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
