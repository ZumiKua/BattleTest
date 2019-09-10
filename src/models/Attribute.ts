export enum Attribute{
    Fire, Water, Earth, Wind, Electric
}
const MATCHUPS = {
    [Attribute.Water]: Attribute.Fire,
    [Attribute.Electric]: Attribute.Water,
    [Attribute.Earth]: Attribute.Electric,
    [Attribute.Wind]: Attribute.Earth,
    [Attribute.Fire]: Attribute.Wind
}

export function isEffective(a: Attribute, b: Attribute) {
    return MATCHUPS[a] === b;
}

export function isIneffective(a: Attribute, b: Attribute) {
    return isEffective(b, a);
}