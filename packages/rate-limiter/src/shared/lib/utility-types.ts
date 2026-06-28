/** biome-ignore-all lint/suspicious/noExplicitAny: `any` type is necessary for valid type mappings */
export type ExtractMember<T, U extends T> = T extends U ? T : never;

// export type DeepRequired<T> = {
//     [Key in keyof T]-?: T[Key] extends Record<string, unknown> ? DeepRequired<T[Key]> : T[Key];
// };

export type DeepPartial<T> = {
    [Key in keyof T]?: T[Key] extends object ? DeepPartial<Partial<T[Key]>> : Partial<T[Key]>;
};

export type PartialUnionMembers<T> = T extends any ? Partial<T> : never;

export type OptionalToNull<T> = {
    [K in keyof T]-?: undefined extends T[K] ? T[K] | null : T[K];
};

type IsNever<T> = [T] extends [never] ? true : false;

type NormalizeOptionalNever<T> = {
    [K in keyof T]-?: IsNever<Exclude<T[K], undefined>> extends true ? null : T[K] | null;
};

export type NormalizeOptionalNeverUnion<T> = T extends any ? NormalizeOptionalNever<T> : never;

export type Remap<T> = {
    [K in keyof T]: T[K] extends Record<string, unknown> ? Remap<T[K]> : T[K];
} & {};

export type Assignable<Base, Child extends Base> = Child extends Base ? true : false;

type ExtractTypeFromUnion<U, K extends string | number | symbol> = U extends any ? (K extends keyof U ? Exclude<U[K], never | undefined> : never) : never;

export type FlattenOptionalNeverUnion<U> = {
    [K in U extends any ? keyof U : never]?: ExtractTypeFromUnion<U, K>;
};

export type OmitFields<T, K extends keyof T> = Omit<T, K>;

export type DeepRequired<T> = T extends object
    ? {
          [P in keyof T]-?: DeepRequired<T[P]>;
      }
    : T;
