"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Address = /** @class */ (function () {
    function Address(district, street) {
        this.district = district;
        this.street = street;
    }
    return Address;
}());
exports.Address = Address;
var Street = /** @class */ (function () {
    function Street(idTeryt, nazwa) {
        this.idTeryt = idTeryt;
        this.nazwa = nazwa;
    }
    return Street;
}());
exports.Street = Street;
var District = /** @class */ (function () {
    function District(idTeryt, nazwa) {
        this.idTeryt = idTeryt;
        this.nazwa = nazwa;
    }
    return District;
}());
exports.District = District;
