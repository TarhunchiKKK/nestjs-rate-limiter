export type ExtractMember<T, U extends T> = T extends U ? T : never;
