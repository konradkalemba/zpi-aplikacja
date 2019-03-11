"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Pg = __importStar(require("pg"));
var Fs = __importStar(require("fs"));
var PgCon = /** @class */ (function () {
    function PgCon(host, db, user, pass, caFile) {
        this.host = host;
        this.db = db;
        this.user = user;
        this.pass = pass;
        this.caFile = caFile;
    }
    return PgCon;
}());
function makeConfig() {
    var confJson = Fs.readFileSync('./pg-con.json', 'utf-8');
    var conf = JSON.parse(confJson);
    return {
        user: conf.user,
        database: conf.db,
        password: conf.pass,
        host: conf.host,
        ssl: {
            rejectUnauthorized: true,
            ca: Fs.readFileSync(conf.caFile)
        }
    };
}
function makePool() {
    return new Pg.Pool(makeConfig());
}
exports.pool = makePool();
