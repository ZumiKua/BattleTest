import { Battler, AttributeDamageResult } from "./Battler";
import { HpDamageResult, DamageMultiplierResult  } from "./Side";
import { ActionData } from "./ActionData";

export class Action{
    user: Battler;
    targets: Battler[] | null;
    data: ActionData;
    private attack: Attack | null;
    private targetPoint: [number, number];

    constructor(ad: ActionData, user: Battler, target: [number, number]) {
        this.data = ad;
        this.targets = null;
        this.attack = null;
        this.user = user;
        this.targetPoint = target;
    }

    canUse(){
        return !this.user.isDead();
    }

    step() : boolean{
        if(!this.canUse()){
            return false;
        }
        if(this.targets === null) {
            let side = this.user.side.opponent;
            this.targets = this.data.targetArea.map(point => {
                let x = (this.targetPoint[0] + point[0]);
                let y = (this.targetPoint[1] + point[1]);
                if(x > 1 || x < 0 || y > 2 || y < 0) {
                    return undefined;
                }
                return side!.getBattler([x,y]);
            }).filter(v => v !== undefined) as Battler[];
        }
        if(this.targets.length === 0) {
            this.user.side.onActionEnd();
            return false;
        }
        let t = this.targets.shift();
        this.attack = new Attack(this.user, t!, this);
        return true;
    }

    getCurrentAttack() : Attack | null{
        return this.attack;
    }
}

export class Attack{
    user: Battler;
    target: Battler;
    action: Action;
    hpDamageResult: HpDamageResult;
    damageMultiplierResult: DamageMultiplierResult | null;
    attributeDamageResult: AttributeDamageResult;

    constructor(user: Battler, target: Battler, action: Action){
        this.user = user;
        this.target = target;
        this.action = action;
        let hpDamage = this.user.side.damageMultiplier * this.action.data.hpDamage;
        this.hpDamageResult = this.target.side.applyHpDamage(hpDamage);
        this.damageMultiplierResult = null;
        if(this.action.data.attribute === this.target.getCurrentAttribute() && this.target.isWeakState()) {
            this.damageMultiplierResult = this.user.side.onDamageWeakState(this.action);
        }
        this.attributeDamageResult = this.target.applyAttributeDamage(this.action.data.attribute, this.action.data.attributeDamage);
    }
}