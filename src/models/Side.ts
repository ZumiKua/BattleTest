import { Battler, BattlerData, Position } from "./Battler";

export class Side{
    
    opponent: Side | null;
    damageMultiplier: number;
    thisActionDamageMultiplier: number;
    damageMultiplierDelta: number;
    battlers: Battler[];
    hp: number;
    sp: number;
    
    constructor(data: SideData) {
        //this.battlers = data.battlers.map(v => new Battler(this, v));
        this.battlers = Object.entries(data.battlerPositions).filter(([_, id]) => id !== undefined).map(([pos, id], index) => 
            new Battler(this, data.battlers.find(b => b.id === id)!, parseInt(pos) as Position, index)
        );
        console.log(data.battlerPositions, data.battlers);
        console.log(this.battlers);
        this.damageMultiplier = 1.0;
        this.thisActionDamageMultiplier = 1.0;
        this.damageMultiplierDelta = 0.2;
        this.opponent = null;
        this.hp = data.hp;
        this.sp = data.sp;
    }

    getBattler(position: [number, number]) : Battler | undefined {
        const flatPosition = position[0] * 2 + position[1];
        return this.battlers.find(b => b.position === flatPosition);
    }
    

    setOpponent(side: Side) {
        this.opponent = side;
    }

    applyHpDamage(hpDamage: number): HpDamageResult {
        this.hp -= hpDamage;
        if(this.hp < 0) {
            this.hp = 0;
        }
        return {hpDamage: hpDamage, isDead: this.hp === 0};
    }

    applySpRecovery(spRecovery: number): SpRecoveryResult {
        const oldSp = this.sp;
        this.sp += spRecovery;
        if(this.sp >= 10) {
            this.sp = 10;
        }
        if(this.sp < 0) {
            this.sp = 0;
        }
        return this.sp - oldSp;
    }

    onDamageWeakState(isEffective: boolean): DamageMultiplierResult {
        let ret = {multiplierAdded: this.damageMultiplierDelta};
        this.thisActionDamageMultiplier += this.damageMultiplierDelta;
        this.damageMultiplierDelta += 0.2;
        return ret;
    }

    onActionEnd() {
        this.damageMultiplier = this.thisActionDamageMultiplier;
    }

    onTurnStart() {
        this.damageMultiplier = 1.0;
        this.thisActionDamageMultiplier = 1.0;
        this.damageMultiplierDelta = 0.2;
        this.battlers.forEach(b => b.onTurnStart());
        if(this.sp <= 3) {
            this.sp = 3;
        }
    }

    getDisplayDamageMultiplier(): number{
        return this.thisActionDamageMultiplier;
    }


}

export interface HpDamageResult{
    hpDamage: number;
    isDead: boolean;
}

export type SpRecoveryResult = number;

export interface SideData{
    battlerPositions: {[p in Position]? : number|undefined};
    battlers: BattlerData[];
    hp: number;
    sp: number;
}

export interface DamageMultiplierResult{
    multiplierAdded: number;
}
