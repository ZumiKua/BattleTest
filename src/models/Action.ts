import { HpDamageResult, Battler, Position, AttributeDamageResult, DpRecoveryResult, DefenceIncreaseResult, FlatPosToXY } from "./Battler";
import { DamageMultiplierResult, Side, SpRecoveryResult  } from "./Side";
import { ActionData } from "./ActionData";

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
    hpDamageResult: HpDamageResult;
    spRecoveryResult: SpRecoveryResult;
    dpRecoveryResult: DpRecoveryResult;
    defenceIncreaseResult: DefenceIncreaseResult;
    damageMultiplierResult: DamageMultiplierResult | null;
    attributeDamageResult: AttributeDamageResult;

    constructor(user: Battler, target: Battler, action: Action){
        this.user = user;
        this.target = target;
        this.action = action;
        let hpDamage = this.user.side.damageMultiplier * this.action.data.hpDamage;
        this.hpDamageResult = this.target.applyHpDamage(hpDamage);
        this.damageMultiplierResult = null;
        this.spRecoveryResult = this.target.side.applySpRecovery(this.action.data.spRecovery);
        this.dpRecoveryResult = this.target.applyDpRecovery(this.action.data.dpRecovery);
        this.defenceIncreaseResult = this.target.applyDefenceIncrease(this.action.data.defenceIncrease);
        //TODO: we can combine damageMultiplierResult and attributeDamageResult.
        if(this.action.data.attribute === this.target.getCurrentAttribute() && this.target.isWeakState()) {
            this.damageMultiplierResult = this.user.side.onDamageWeakState(this.action);
        }
        this.attributeDamageResult = this.target.applyAttributeDamage(this.action.data.attribute, this.action.data.attributeDamage);
    }
}