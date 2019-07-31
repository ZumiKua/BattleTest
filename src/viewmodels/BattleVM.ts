import { Side, SideData } from "../models/Side";
import { Action, Attack } from "../models/Action";
import { ActionData } from "../models/ActionData";
import { Battler, Position, FlatPosToXY } from "../models/Battler";
import { Observable, BehaviorSubject } from "rxjs" 

export type InputtingPhase = "decideBattler" | "decideAction" | "decideTarget" | undefined;
export type Phase = "inputting"|"processing" | undefined;

const UPDATE_INTERVAL = 200;

export class BattleVM {
    private _sideA: Side;
    private _sideB: Side;
    private _actions: BehaviorSubject<Action[]>;
    private _phase: BehaviorSubject<Phase>;
    private _sidesSubject: BehaviorSubject<[Side, Side]>;
    private _inputtingPhase: BehaviorSubject<InputtingPhase>;
    private _actionResults : BehaviorSubject<Attack[]>;
    private currentProcessingAction: Action | undefined;
    private _inputtingAction: ActionData | undefined;
    private _currentInputtingBattler: Battler | undefined;
    private _nextActionId: number;

    constructor(sideA: SideData, sideB: SideData) {
        this._sideA = new Side(sideA);
        this._sideB = new Side(sideB);
        this._sideA.setOpponent(this._sideB);
        this._sideB.setOpponent(this._sideA);
        this._sidesSubject = new BehaviorSubject([this._sideA, this._sideB]);
        this._actions = new BehaviorSubject([] as Action[]);
        this._phase = new BehaviorSubject(undefined as Phase);
        this._inputtingPhase = new BehaviorSubject(undefined as InputtingPhase);
        this._actionResults = new BehaviorSubject([] as Attack[]);
        this._actions.next([]);
        this._actionResults.next([]);
        this.currentProcessingAction = undefined;
        this.startTurn();
        this._nextActionId = 0;
    }

    get phase() : Observable<Phase>{
        return this._phase;
    }

    get sideA() {
        return this._sideA;
    }

    get sideB() {
        return this._sideB;
    }

    get actions() : Observable<Action[]>{
        return this._actions;
    }
    
    get sides() : Observable<[Side, Side]> {
        return this._sidesSubject;
    }

    get inputtingPhase() : Observable<InputtingPhase> {
        return this._inputtingPhase;
    }

    get actionResults() : Observable<Attack[]> {
        return this._actionResults;
    }

    get inputtingAction() : ActionData | undefined{
        return this._inputtingAction;
    }

    get targets() : Battler[] | undefined{
        if(this._currentInputtingBattler === undefined) {
            return undefined;
        }
        else{
            return this._currentInputtingBattler!.side.opponent!.battlers; 
        }
    }
    

    addAction(action: ActionData) : boolean{
        this.checkInputting("decideAction");
        if(action.spCost > this._currentInputtingBattler!.side.sp) {
            return false;
        }
        this._inputtingAction = action;
        this._inputtingPhase.next("decideTarget");
        return true;
    }

    setTargets(targets: {left: Position[], right: Position[]}) {
        if(this._inputtingAction!.spCost <= this._currentInputtingBattler!.side.sp) {
            this._currentInputtingBattler!.side.sp -= this._inputtingAction!.spCost;
            
            
            let actionTargets;
            if(this._currentInputtingBattler!.side === this._sideA) {
                actionTargets = {self: targets.left, opponent: targets.right};
            }
            else {
                actionTargets = {self: targets.right, opponent: targets.left};
            }
            this._actions.value.push(new Action(this._inputtingAction!, this._currentInputtingBattler!, actionTargets, this._nextActionId));
            ++this._nextActionId;
        }
        this._inputtingPhase.next("decideBattler");
    }

    selectBattler(battler: Battler) {
        this.checkInputting("decideBattler");
        this._currentInputtingBattler = battler;
        this._inputtingPhase.next("decideAction");
    }

    checkInputting(inputtingPhase: InputtingPhase) {
        if(this._phase.value !== "inputting") {
            throw new Error("phase must be inputting");
        }
        if(this._inputtingPhase.value !== inputtingPhase) {
            throw new Error("inputting phase must be " + inputtingPhase);
        }
    }

    endInputting() {
        this._phase.next("processing");
        this._inputtingPhase.next(undefined);
        this._actionResults.value.length = 0;
        this._actionResults.next(this._actionResults.value);
        this.updateLoop();
    }

    updateLoop() {
        this.update();
        if(this._phase.value === "processing") {
            setTimeout( ()=> this.updateLoop(), UPDATE_INTERVAL);
        }
    }

    update() {
        if(this._phase.value === "inputting") {
            throw new Error("You shouldn't call update in inputting state.");
        }
        while(true) {
            if(this.currentProcessingAction !== undefined) {
                if(this.currentProcessingAction.step()){
                    this._actionResults.value.push(this.currentProcessingAction.getCurrentAttack()!);
                    this._actionResults.next(this._actionResults.value);
                    return;
                }
            }
            this.currentProcessingAction = this._actions.value.shift();
            this._actions.next(this._actions.value);
            if(this.currentProcessingAction === undefined) {
                this.startTurn();
                break;
            }
        }

        //after action processed, side may change.
        this.dispatchSideChanges();
        
    }

    cancelTargetSelection(): void {
        this.checkInputting("decideTarget");
        this._inputtingAction = undefined;
        this._inputtingPhase.next("decideAction");
    }

    cancelActionSelection() : void {
        this.checkInputting("decideAction");
        this._currentInputtingBattler = undefined;
        this._inputtingPhase.next("decideBattler");
    }

    private startTurn() {
        this._sideA.onTurnStart();
        this._sideB.onTurnStart();
        this._phase.next("inputting");
        this._inputtingPhase.next("decideBattler");
        this.dispatchSideChanges();
    }

    onActionDeleted(id: number): void {
        this.checkInputting("decideBattler");
        const index = this._actions.value.findIndex((a) => a.id === id);
        const [action] = this._actions.value.splice(index, 1);
        action.user.side.sp += action.data.spCost;
        this._actions.next(this._actions.value);
    }

    onPositionChange(pos: Position, pos2: Position, isRed: boolean) {
        let side;
        if(isRed) {
            side = this._sideA;
        }
        else {
            side = this._sideB;
        }
        const b1 = side.getBattler(FlatPosToXY(pos));
        const b2 = side.getBattler(FlatPosToXY(pos2));
        if(b1 !== undefined) {
            b1.position = pos2;
        }
        if(b2 !== undefined) {
            b2.position = pos;
        }
        this.dispatchSideChanges();
    }

    private dispatchSideChanges() {
        this._sidesSubject.next([this._sideA, this._sideB]);
    }
    
}