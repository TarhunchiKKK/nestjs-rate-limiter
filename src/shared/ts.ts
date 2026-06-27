export type ExtractMember<T, U extends T> = T extends U ? T : never;

export type DeepRequired<T> = {
    [Key in keyof T]-?: T[Key] extends object ? DeepRequired<Required<T[Key]>> : Required<T[Key]>;
};

export type DeepPartial<T> = {
    [Key in keyof T]?: T[Key] extends object ? DeepPartial<Partial<T[Key]>> : Partial<T[Key]>;
};

export type PartialUnionMembers<T> = T extends any ? Partial<T> : never;

export type OptionalToNull<T> = {
    [K in keyof T]-?: undefined extends T[K] ? T[K] | null : T[K];
};

export type IsNever<T> = [T] extends [never] ? true : false;

export type TransformNeverToNull<T> = {
    [K in keyof T]-?: IsNever<T[K]> extends true ? null : T[K];
};

export type OptionalNeverToNullUnion<T> = T extends any ? TransformNeverToNull<T> : never;

type A = TransformNeverToNull<{
    a: number;
    b: never;
}>;
