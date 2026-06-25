const stringLength = 36;
const substringStart = 2;
const substringEnd = 7;

export function generateSalt() {
    return Math.random().toString(stringLength).substring(substringStart, substringEnd);
}
