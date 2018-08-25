// Reimplementation of lodash's isObjectLike and isPlainObject
// Mainly to keep dependencies low

const symToStringTag = typeof Symbol !== 'undefined' ? Symbol.toStringTag : undefined;

export function getTag(value: any): string {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }

    if (!(symToStringTag && symToStringTag in Object(value))) {
        return Object.prototype.toString.call(value);
    }

    const isOwn = Object.prototype.hasOwnProperty.call(value, symToStringTag);
    const tag = value[symToStringTag];
    let unmasked = false;
    try {
        value[symToStringTag] = undefined;
        unmasked = true;
    } catch(e) {}

    const result = Object.prototype.toString.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag] = tag;
        } else {
            delete value[symToStringTag];
        }
    }

    return result;
}
export const isObjectLike = (obj: any): boolean => typeof obj === 'object' && obj !== null;

export function isPlainObject(obj: any): boolean {
    if (!isObjectLike(obj) || getTag(obj) !== '[object Object]') {
        return false;
    }

    if (Object.getPrototypeOf(obj) === null) {
        return true;
    }

    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }

    return Object.getPrototypeOf(obj) === proto;
}