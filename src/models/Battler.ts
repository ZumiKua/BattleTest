import {Attribute} from "./Attribute"
import { Side, HpDamageResult as SideHpDamageResult } from "./Side";
export class Battler{
    maxDp: number;
    dp: number;
    attributeResistances: {[key in Attribute]: number}
    side: Side;
    private currentAttribute: {attribute: Attribute | null, point: number}
    private weakState: boolean;
    private thisTurnDpDamaged: boolean;
    position: Position;
    name: string;
    id: number;
    defence: number;

    constructor(side: Side, data: BattlerData) {
        this.position = data.position;
        this.side = side;
        this.dp = data.dp;
        this.maxDp = data.dp;
        this.attributeResistances = data.attributeResistances;
        this.currentAttribute = {attribute: null, point: 0};
        this.weakState = false;
        this.thisTurnDpDamaged = false;
        this.name = data.name;
        this.id = data.id;
        this.defence = 0;
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

    applyDpRecovery(dpRecovery: number): DpRecoveryResult {
        const oldDp = this.dp;
        this.dp += dpRecovery;
        if(this.dp >= this.maxDp){
            this.dp = this.maxDp;
        }
        if(this.dp < 0) {
            this.dp = 0;
        }
        
        return this.dp - oldDp;
    }

    applyDefenceIncrease(defenceIncrease: number): DefenceIncreaseResult {
        this.defence += defenceIncrease;
        console.log(this, defenceIncrease);
        return defenceIncrease;
    }

    applyHpDamage(hpDamage: number): HpDamageResult {
        let defended;
        if(this.defence < hpDamage) {
            defended = this.defence;
            hpDamage -= this.defence;
            this.defence = 0;
            
        }
        else{
            this.defence -= hpDamage;
            defended = hpDamage;
            hpDamage = 0;
        }
        return {...this.side.applyHpDamage(hpDamage), defended};
        
    }

    onTurnStart() : void{
        this.thisTurnDpDamaged = false;
        this.weakState = false;
        this.defence = 0;
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
export function FlatPosToXY(pos: Position) : [0|1|2, 0|1]{
    return [Math.floor(pos / 2), pos % 2] as [0|1|2, 0|1];
}

export function XYPosToFlat(x: 0|1|2, y: 0|1): Position {
    return x * 2 + y as Position;
}

export interface HpDamageResult extends SideHpDamageResult{
    defended: number;
}

export type DpRecoveryResult = number;
export type DefenceIncreaseResult = number;