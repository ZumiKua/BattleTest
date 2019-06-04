import React from "react";
import { SideData } from "../models/Side";
import { ActionData } from "../models/ActionData";
import { Phase, BattleVM, InputtingPhase } from "../viewmodels/BattleVM";
import { Action, Attack } from "../models/Action";
import { Subscription } from "rxjs";
import { SideView } from "./SideView";
import { ActionView } from "./ActionView";
import { TargetView } from "./TargetView";
import { Battler } from "../models/Battler";

interface Props{
    sideA: SideData | undefined;
    sideB: SideData | undefined;
    actions: ActionData[] | undefined;
}
interface State {
    phase: Phase;
    inputtingPhase: InputtingPhase;
    actionResults: Attack[];
    actions: Action[];
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
            actions: []
        }
        this.onActionClicked = this.onActionClicked.bind(this);
        this.onTargetSelected = this.onTargetSelected.bind(this);
        this.onBattlerSelected = this.onBattlerSelected.bind(this);
    }

    createVM() {
        this.subscription!.unsubscribe();
        this.subscription = new Subscription();
        this.battleVM = undefined;
        if(this.props.sideA !== undefined && this.props.sideB !== undefined) {
            this.battleVM = new BattleVM(this.props.sideA, this.props.sideB);
            this.battleVM!.phase.subscribe(p => this.setState({phase: p}));
            this.battleVM!.inputtingPhase.subscribe(p => this.setState({inputtingPhase: p}));
            this.battleVM!.actionResults.subscribe(r => this.setState({actionResults: r}));
            this.battleVM!.actions.subscribe(a => this.setState({actions: a}));
        }
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
            this.subscription = new Subscription();
            d.forEach(d => this.subscription!.add(d));
        }
    }

    componentDidMount() {
        this.registerSubscriptions();
    }

    componentDidUpdate() {
        this.registerSubscriptions();
    }

    onActionClicked(action: ActionData) {
        this.battleVM!.addAction(action);
    }

    onTargetSelected(target: [number, number]) {
        this.battleVM!.setTarget(target);
    }

    onBattlerSelected(battler: Battler) {
        this.battleVM!.selectBattler(battler);
    }

    render() {
        this.recreateBattleVM();
        if(this.battleVM === undefined) {
            return <React.Fragment/>
        }
        let actions = null;
        console.log(this.state.inputtingPhase);
        if(this.props.actions !== undefined && this.state.inputtingPhase === "decideAction") {
            actions = <div className="actions"> {
                this.props.actions.map((action, id) => 
                    <ActionView action={action} key={id} onClicked={this.onActionClicked}/>)
            } </div>
        }
        let target = null;
        if(this.state.inputtingPhase === "decideTarget") {
            target = <TargetView battlers={this.battleVM.targets!} onTargetSelected={this.onTargetSelected} areas={this.battleVM.inputtingAction!.targetArea}/>
        }
        return <div>
            <SideView side={this.battleVM!.sideA} onBattlerClick={this.onBattlerSelected}/>
            <SideView side={this.battleVM!.sideB} onBattlerClick={this.onBattlerSelected}/>
            {
                actions !== null ? actions : <React.Fragment />
            }
            {
                target !== null ? target : <React.Fragment />
            }
            
        </div>
    }
}