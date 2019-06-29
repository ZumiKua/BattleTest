import {Attribute} from "./Attribute"
import { Side } from "./Side";
export class Battler{
    dp: number;
    attributeResistances: {[key in Attribute]: number}
    side: Side;
    private currentAttribute: {attribute: Attribute | null, point: number}
    private weakState: boolean;
    private thisTurnDpDamaged: boolean;
    position: number;
    name: string;
    id: number;

    constructor(side: Side, data: BattlerData) {
        this.position = data.position;
        this.side = side;
        this.dp = data.dp;
        this.attributeResistances = data.attributeResistances;
        this.currentAttribute = {attribute: null, point: 0};
        this.weakState = false;
        this.thisTurnDpDamaged = false;
        this.name = data.name;
        this.id = data.id;
    }

    getCurrentAttribute() : Attribute | null { 
        return this.currentAttribute.attribute;
    }

    getAttributePoint(): number {
        return this.currentAttribute.point;
    }    

    applyAttributeDamage(attribute: Attribute, attributeDamage: number): AttributeDamageResult{
        let result: AttributeDamageResult = {dpDamage: 0, attributePointAttached: 0, knockedIntoWeak: false, attribute: null};
        
        if(this.weakState && !this.thisTurnDpDamaged) {
            result.dpDamage = 1;
            this.dp -= 1;
            this.thisTurnDpDamaged = true;
        }
        if(this.weakState) {
            //in weak state, attribute point won't increase anymore.
            return result;
        }
        result.attribute = attribute;
        result.attributePointAttached = attributeDamage;
        if(this.currentAttribute.attribute === attribute) {
            this.currentAttribute.point += attributeDamage;
        }
        else{
            this.currentAttribute.attribute = attribute;
            this.currentAttribute.point = attributeDamage;
        }
        let resist = this.attributeResistances[attribute];
        if(resist !== 0 && resist <= this.currentAttribute.point) {
            this.weakState = true;
            this.currentAttribute.point = 0;
            result.knockedIntoWeak = true;
        }
        return result;
    }

    onTurnStart() : void{
        this.thisTurnDpDamaged = false;
        this.weakState = false;
    }

    isDead() : boolean {
        return this.dp <= 0;
    }

    isWeakState(): boolean {
        return this.weakState;
    }
}
export interface AttributeDamageResult{
    knockedIntoWeak: boolean;
    dpDamage: number;
    attribute: Attribute | null;
    attributePointAttached: number;
}
export interface BattlerData{
    name: string;
    dp: number;
    id: number;
    attributeResistances: {[key in Attribute]: number};
    position: 0|1|2|3|4|5;
}
export type Position = 0|1|2|3|4|5;