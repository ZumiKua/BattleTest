import {Attribute, isEffective, isIneffective} from "./Attribute"
import { Side, HpDamageResult as SideHpDamageResult, DamageMultiplierResult } from "./Side";
export class Battler {
    maxDp: number;
    dp: number;
    initialDp: number;
    side: Side;
    private weakState: boolean;
    private thisTurnDamaged: boolean;
    attribute: Attribute;
    position: Position;
    name: string;
    id: number;
    defence: number;

    constructor(side: Side, data: BattlerData, position: Position, id: number) {
        this.position = position;
        this.side = side;
        this.dp = data.dp;
        this.maxDp = data.dp;
        this.initialDp = data.dp;
        this.weakState = false;
        this.name = data.name;
        this.attribute = data.attribute;
        this.thisTurnDamaged = false;
        this.id = id;
        this.defence = 0;
    }

    applyAttributeDamage(attribute: Attribute): AttributeDamageResult{
        let result: AttributeDamageResult = {dpDamage: 0, knockedIntoWeak: false, damageMultipiler: null};
        if(this.weakState) {
            if(!isIneffective(attribute, this.attribute)) {
                result.damageMultipiler = this.side.onDamageWeakState(isEffective(attribute, this.attribute));
            }
        }
        if(isEffective(attribute, this.attribute)) {
            this.dp -= 2;
            result.dpDamage = 2;
        }
        else if(isIneffective(attribute, this.attribute)) {
            return result;
        }
        else {
            this.dp -= 1;
            result.dpDamage = 1;
        }
        if(this.dp <= 0) {
            this.dp = 0;
            this.weakState = true;
            result.knockedIntoWeak = true;
        }
        return result;
    }

    applyRecoverFromWeakState(): WeakStateRecoverResult{
        if(this.weakState) {
            this.weakState = false;
            this.dp = this.maxDp;
            return true;
        }
        return false;
    }

    applyDpRecovery(dpRecovery: number): DpRecoveryResult {
        if(this.weakState) {
            //we can't recover dp in weak state.
            return 0;
        }
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

    applyHpDamage(hpDamage: number, attribute: Attribute): HpDamageResult {
        if(isIneffective(attribute, this.attribute) && !this.weakState) {
            hpDamage *= 0.5;
        }
        if(hpDamage > 0 && this.weakState) {
            this.thisTurnDamaged = true;
        }
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
        if(this.thisTurnDamaged && this.weakState) {
            this.weakState = false;
            this.maxDp -= 1;
            this.dp = this.maxDp;
        }
        this.thisTurnDamaged = false;
        this.defence = 0;
    }

    isDead() : boolean {
        return this.maxDp <= 0;
    }

    isWeakState(): boolean {
        return this.weakState;
    }
}
export interface AttributeDamageResult{
    knockedIntoWeak: boolean;
    dpDamage: number;
    damageMultipiler: DamageMultiplierResult | null;
}
export interface BattlerData{
    name: string;
    dp: number;
    id: number;
    attribute: Attribute;
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
export type WeakStateRecoverResult = boolean;