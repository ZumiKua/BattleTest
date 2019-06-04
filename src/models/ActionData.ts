import { Attribute } from "./Attribute";

export interface ActionData{
    spCost: number;
    targetArea: [number, number][];
    hpDamage: number;
    attribute: Attribute;
    attributeDamage: number;
    name: string;
}