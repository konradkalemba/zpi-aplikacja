export class BenchmarkConfig {
    constructor(
        public iterations: number,
        public district: string,
        public descriptionFile: string) {

    }
}

export interface BenchmarkConfig {
    run(conf: BenchmarkConfig): Promise<number> // czas w milisekundach
}

