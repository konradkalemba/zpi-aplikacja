export class Address {
    constructor(
        public district: District | null,
        public street: Street | null
    ) { }
}

export class Street {
    constructor(
        public idTeryt: number,
        public nazwa: string
    ) { }
}

export class District {
    constructor(
        public idTeryt: number,
        public nazwa: string
    ) { }
}