import React from "react";
import { SideData, Side } from "../models/Side";
import { ActionData } from "../models/ActionData";
import { Phase, BattleVM, InputtingPhase } from "../viewmodels/BattleVM";
import { Action, Attack } from "../models/Action";
import { Subscription } from "rxjs";
import { SideView } from "./SideView";
import { TargetView } from "./TargetView";
import { Battler, Position } from "../models/Battler";
import { ResultView } from "./ResultView";
import { ActionSelectionView } from "./ActionSelectionView";
import { ActionRecordsView } from "./ActionRecordsView";
import { Redirect } from "react-router";

interface Props{
    sideA: SideData | undefined;
    sideB: SideData | undefined;
    actionDatas: ActionData[] | undefined;
}
interface State {
    phase: Phase;
    inputtingPhase: InputtingPhase;
    actionResults: Attack[];
    actions: Action[];
    sideA: Side | undefined;
    sideB: Side | undefined;
}

export class BattleView extends React.Component<Props, State>{

    private subscription : Subscription | undefined;
    private battleVM : BattleVM | undefined;
    private previousProps : Props | undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            phase: undefined,
            inputtingPhase: undefined,
            actionResults: [],
            actions: [],
            sideA: undefined,
            sideB: undefined
        }
        this.onActionClicked = this.onActionClicked.bind(this);
        this.onTargetSelected = this.onTargetSelected.bind(this);
        this.onBattlerSelected = this.onBattlerSelected.bind(this);
        this.onTargetSelectionClosed = this.onTargetSelectionClosed.bind(this);
        this.onActionSelectionClosed = this.onActionSelectionClosed.bind(this);
        this.onActionDeleted = this.onActionDeleted.bind(this);
        this.onPositionChange = this.onPositionChange.bind(this);
    }

    recreateBattleVM() {
        if(this.previousProps !== this.props){

            this.previousProps = this.props;

            if(this.subscription !== undefined) {
                this.subscription!.unsubscribe();
                this.subscription = undefined;
            }
            
            this.battleVM = undefined;
            if(this.props.sideA !== undefined && this.props.sideB !== undefined) {
                this.battleVM = new BattleVM(this.props.sideA, this.props.sideB);
                this.registerSubscriptions();
            }

        }
    }

    registerSubscriptions() {
        if(this.subscription === undefined && this.battleVM !== undefined) {
            let d = [];
            d[0] = this.battleVM!.phase.subscribe(p => this.setState({phase: p}));
            d[1] = this.battleVM!.inputtingPhase.subscribe(p => this.setState({inputtingPhase: p}));
            d[2] = this.battleVM!.actionResults.subscribe(r => this.setState({actionResults: r}));
            d[3] = this.battleVM!.actions.subscribe(a => this.setState({actions: a}));
            d[4] = this.battleVM!.sides.subscribe(([sideA, sideB]) => {
                console.log("side changed", sideA);
                this.setState({sideA, sideB});
            });
            this.subscription = new Subscription();
            d.forEach(d => this.subscription!.add(d));
        }
    }

    //as per React's documention, it is recommended to listen changes here.
    componentDidMount() {
        this.registerSubscriptions();
    }

    componentDidUpdate() {
        this.registerSubscriptions();
    }

    onActionClicked(action: ActionData) {
        this.battleVM!.addAction(action);
    }

    onTargetSelected(targets: {left: Position[], right: Position[]}) {
        this.battleVM!.setTargets(targets);
    }

    onBattlerSelected(battler: Battler) {
        this.battleVM!.selectBattler(battler);
    }

    onEndTurn() {
        this.battleVM!.endInputting();
    }

    onTargetSelectionClosed() {
        this.battleVM!.cancelTargetSelection();
    }

    onActionSelectionClosed() {
        this.battleVM!.cancelActionSelection();
    }

    onActionDeleted(id: number) {
        this.battleVM!.onActionDeleted(id);
    }

    onPositionChange(pos: Position, pos2: Position, isRed: boolean) {
        this.battleVM!.onPositionChange(pos, pos2, isRed);
    }

    render() {
        this.recreateBattleVM();
        if(this.battleVM === undefined) {
            return <Redirect to="/"/>
        }
        let actions = null;
        console.log(this.state.inputtingPhase);
        if(this.props.actionDatas !== undefined && this.state.inputtingPhase === "decideAction") {
            actions = <ActionSelectionView onActionClicked={this.onActionClicked} actionDatas={this.props.actionDatas} onActionSelectionClosed={this.onActionSelectionClosed}
            />
        }
        let target = null;
        if(this.state.inputtingPhase === "decideTarget") {
            target = <TargetView battlersLeft={this.state.sideA!.battlers} battlersRight={this.state.sideB!.battlers} onTargetSelected={this.onTargetSelected} onClose={this.onTargetSelectionClosed}/>
        }
        if(this.state.sideA === undefined || this.state.sideB === undefined) {
            return <></>;
        }
        return <div className="container battle-view">
            <div className="columns">
                <SideView isRed={true} side={this.state.sideA!} onBattlerClick={this.onBattlerSelected} onPositionChange={(p1,p2) => this.onPositionChange(p1, p2, true)}/>
                <SideView isRed={false} side={this.state.sideB!} onBattlerClick={this.onBattlerSelected} onPositionChange={(p1,p2) => this.onPositionChange(p1, p2, false)}/>
            </div>
            <ActionRecordsView actions={this.state.actions} onActionDeleted={this.onActionDeleted} />
            <div className="control">
                {
                    this.state.phase === "inputting" ? <button className="button" onClick={() => this.onEndTurn()}>结束回合</button> : null
                }
            </div>
            
            <div className={`modal-container ${actions !== null || target !== null ? "show" : ""}`}>
                {
                    actions !== null ? actions : <React.Fragment />
                }
                {
                    target !== null ? target : <React.Fragment />
                }

            </div>
            {
                this.state.actionResults.map((result, key) => <ResultView key={key} result={result}/>)
            }
        </div>
    }
}