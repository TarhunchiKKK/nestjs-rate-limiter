export function isClass(target: Function): boolean {
    return target.toString().startsWith("class");
}

export function isFunction(target: Function): boolean {
    return target.toString().startsWith("function");
}
