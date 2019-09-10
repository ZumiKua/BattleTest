import { HpDamageResult, Battler, Position, AttributeDamageResult, DpRecoveryResult, DefenceIncreaseResult, FlatPosToXY } from "./Battler";
import { Side, SpRecoveryResult  } from "./Side";
import { ActionData } from "./ActionData";
import { randomBytes } from "crypto";

export class Action{
    user: Battler;
    targets: Battler[] | null;
    data: ActionData;
    id: number;
    private attack: Attack | null;
    private targetPoints: {self: Position[], opponent: Position[]};

    constructor(ad: ActionData, user: Battler, targets: {self: Position[], opponent: Position[]}, id: number) {
        this.data = ad;
        this.targets = null;
        this.attack = null;
        this.user = user;
        this.targetPoints = targets;
        this.id = id;
    }

    canUse(){
        return !this.user.isDead();
    }

    private fetchBattlers(side: Side, positions: Position[]) : Battler[]{
        return positions.map(p => side.getBattler(FlatPosToXY(p))).filter(b => b !== undefined) as Battler[];
    }

    step() : boolean{
        if(!this.canUse()){
            return false;
        }
        if(this.targets === null) {
            this.targets = [...this.fetchBattlers(this.user.side, this.targetPoints.self), ...this.fetchBattlers(this.user.side.opponent!, this.targetPoints.opponent)];
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
    hitted: boolean;
    hpDamageResult: HpDamageResult | undefined;
    spRecoveryResult: SpRecoveryResult | undefined;
    dpRecoveryResult: DpRecoveryResult | undefined;
    defenceIncreaseResult: DefenceIncreaseResult | undefined;
    attributeDamageResult: AttributeDamageResult | undefined;

    constructor(user: Battler, target: Battler, action: Action){
        this.user = user;
        this.target = target;
        this.action = action;
        this.hitted = this.calculateHitted(user, target);
        if(this.hitted) {
            let hpDamage = this.user.side.damageMultiplier * this.action.data.hpDamage;
            this.hpDamageResult = this.target.applyHpDamage(hpDamage, this.action.data.attribute);
            this.spRecoveryResult = this.target.side.applySpRecovery(this.action.data.spRecovery);
            this.dpRecoveryResult = this.target.applyDpRecovery(this.action.data.dpRecovery);
            this.defenceIncreaseResult = this.target.applyDefenceIncrease(this.action.data.defenceIncrease);
            this.attributeDamageResult = this.target.applyAttributeDamage(this.action.data.attribute);
            if(this.action.data.weakStateRecover) {
                this.target.applyRecoverFromWeakState();
            }
        }
    }

    calculateHitted(user: Battler, target: Battler) : boolean{
        const userPos = FlatPosToXY(user.position);
        const targetPos = FlatPosToXY(target.position);
        const row = Math.abs(userPos[0] - targetPos[0]) * 0.1;
        let col;
        switch(targetPos[1] + userPos[1]){
            case 0: 
                col = 0.2;
                break;
            case 1:
                col = 0.1;
                break;
            case 2:
                col = 0;
                break;
            default:
                throw new Error("unknown col");
        }
        console.log("HitRate: ", 1 - col - row);
        return Math.random() > col + row;
    }
}