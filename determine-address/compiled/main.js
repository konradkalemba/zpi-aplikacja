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
var addressQuery_1 = require("./addressQuery");
var determinePg_1 = require("./determinePg");
var determineNode_1 = require("./determineNode");
var q = new addressQuery_1.AddressQuery('Wrocław, Dolnośląskie, Fabryczna ', "\n\n\n2-pok. oddzielna kuchnia, ul. legnicka 49 PIXEL HOUSE/MAGNOLIA\nWroc\u0142aw, Dolno\u015Bl\u0105skie, Fabryczna Dodane o 18:12, 11 marca 2019, ID og\u0142oszenia: 451502429\nWyr\u00F3\u017Cnij to og\u0142oszenie Od\u015Bwie\u017C to og\u0142oszenie\nOferta od \tOsoby prywatnej\n\t\nPoziom \t4\nUmeblowane \tTak\n\t\nRodzaj zabudowy \tApartamentowiec\nPowierzchnia \t48 m\u00B2\n\t\nLiczba pokoi \t2 pokoje\nCzynsz (dodatkowo) \t400 z\u0142\n\t \n2-pokojowe mieszkanie w nowym budownictwie w pe\u0142nym rozk\u0142adzie 48m. plus 2 loggie ponad 6m.\n\nNIERUCHOMO\u015A\u0106\nLokal po\u0142o\u017Cony jest na 3-tym pi\u0119trze 9-kondygnacyjnego nowoczesnego budynku oddanego w 2018 r. Teren jest monitorowany i strze\u017Cony 24/7.\nMieszkanie jest gotowe do zamieszkania oraz w pe\u0142ni umeblowane i wyposa\u017Cone w sprz\u0119t AGD. Wszystkie sprz\u0119ty jak i meble nowe, podwy\u017Cszony standard. Bez prowizji od najemcy, og\u0142oszenie prywatne. Do zamieszkania od 10.04.\n\n-pok\u00F3j 1\n-pok\u00F3j 2\n-\u0142azienka\n-przedpok\u00F3j\n-loggia 1\n-loggia 2\n\nLOKALIZACJA PIXEL HOUSE\nJest to centralna cz\u0119\u015B\u0107 miasta i jedna z bardziej po\u017C\u0105danych lokalizacji, m.in ze wzgl\u0119du na sprawne po\u0142\u0105czenie komunikacj\u0105 miejsk\u0105 z pozosta\u0142ymi cz\u0119\u015Bciami Wroc\u0142awia. W okolicy nie brakuje punkt\u00F3w us\u0142ugowo-handlowych (Galeria Magnolia), restauracji, kawiarni, teren\u00F3w zielonych (Park Popowicki), basen wejherowska, si\u0142ownia mc fit, Kaufland, Tesco, piekarnia, Biedronka, na dole budynku \u017Babka.\n\nCENA\n2300,- czynsz najmu\n400,- czynsz administracyjny\n+ pr\u0105d wed\u0142ug zu\u017Cycia\nkaucja 2600 z\u0142.\n\nKONTAKT.\n502 - poka\u017C numer telefonu -\n\n\n");
function bench() {
    return __awaiter(this, void 0, void 0, function () {
        var pgTimes, nodeTimes, i, begin, res, end;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pgTimes = new Array();
                    nodeTimes = new Array();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 100)) return [3 /*break*/, 5];
                    begin = process.hrtime.bigint();
                    return [4 /*yield*/, determineNode_1.determineNode(q)];
                case 2:
                    res = _a.sent();
                    end = process.hrtime.bigint();
                    pgTimes.push(end - begin);
                    begin = process.hrtime.bigint();
                    return [4 /*yield*/, determinePg_1.determinePg(q)];
                case 3:
                    res = _a.sent();
                    end = process.hrtime.bigint();
                    nodeTimes.push(end - begin);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("PG: " + avg(pgTimes) / BigInt(1000000));
                    console.log("Node: " + avg(nodeTimes) / BigInt(1000000));
                    return [2 /*return*/];
            }
        });
    });
}
function avg(a) {
    var v = BigInt(0);
    for (var i = 0; i < a.length; i++) {
        v += a[i];
    }
    return v / BigInt(a.length);
}
bench().then(function () { return console.log('done!'); });
