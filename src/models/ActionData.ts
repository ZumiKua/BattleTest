import { Attribute } from "./Attribute";

export interface ActionData{
    spCost: number;
    hpDamage: number;
    attribute: Attribute;
    attributeDamage: number;
    name: string;
    dpRecovery: number;
    spRecovery: number;
    defenceIncrease: number;
}