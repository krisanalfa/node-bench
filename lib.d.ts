export interface ICountryCodePair {
  Name: string
  Code: string
}

export interface IBenchmarkResult {
  title: string
  requestAverage: number
  latencyAverage: number
  throughputAverage: number
}

export interface IAutocannonOptions {
  title: string
  url: string
  connections: number
  pipelining: number
  duration: number
}

interface IAutocannonCountableResult {
  average: number
}

export interface IAutocannonResult {
  title: string
  requests: IAutocannonCountableResult
  latency: IAutocannonCountableResult
  throughput: IAutocannonCountableResult
}

export type runnable = string[] | ConcatArray<string[]>

export type autocannonAsync = (options: IAutocannonOptions) => Promise<IAutocannonResult>
