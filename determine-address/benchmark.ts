import { AddressMatcher } from "./addressMatcher";
import { AddressQuery } from "./addressQuery";
import { readFile, readFileSync } from "fs";
import { Address } from "./address";

export class BenchmarkConfig {
    constructor(
        public iterations: number,
        public expected: Address,
        public district: string,
        public descriptionFile: string) { }
}

export class BenchmarkResult {
    constructor(
        public timePerIterationMs: bigint,
        public districtCorrect: boolean,
        public streetCorrect: boolean) { }
}

export class Benchmark {
    constructor(private impl: AddressMatcher) { }

    public async run(conf: BenchmarkConfig): Promise<BenchmarkResult> {
        let times = new Array()
        var res = new Address(null, null)
        let q = new AddressQuery(conf.district, readFileSync(conf.descriptionFile, 'utf-8'))
        for (var i = 0; i < 100; i++) {
            let begin = process.hrtime.bigint()
            res = await this.impl.match(q)
            let end = process.hrtime.bigint()
            times.push(end - begin)
        }
        return this.prepareResult(times, res, conf.expected)
    }
    private prepareResult(times: bigint[], res: Address, expected: Address): BenchmarkResult {
        var districtCorrect = false
        if (expected.district == null) {
            if (res.district == null)
                districtCorrect = true
        } else if (res.district != null && res.district.isEqual(expected.district))
            districtCorrect = true

        var streetCorrect = false
        if (expected.street == null) {
            if (res.street == null)
                streetCorrect = true
        } else if (res.street != null && res.street.isEqual(expected.street))
            streetCorrect = true

        return new BenchmarkResult(this.avg(times) / BigInt(1000000), districtCorrect, streetCorrect)
    }
    private avg(a: bigint[]) {
        let v = BigInt(0)
        for (var i = 0; i < a.length; i++) {
            v += a[i]
        }
        return v / BigInt(a.length)
    }
}

