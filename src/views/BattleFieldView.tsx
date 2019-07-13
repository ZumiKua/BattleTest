import React from "react";
import { Battler, Position } from "../models/Battler";
import { ATTRIBUTE_NAME } from "./AttributeName";

interface Props{
    battlers: Battler[];
    isLeft: boolean;
    onBattlerClick: (b: Battler) => void
}

function BattlerBriefView(props: {pos: Position, battler: Battler | undefined, enter: (pos: Position) => void, exit: (pos: Position) => void, onClick: (b: Battler) => void}){
    if(props.battler === undefined) {
        return <td onMouseEnter={() => props.enter(props.pos)} onMouseLeave={() => props.exit(props.pos)}></td>
    }
    return <td onMouseEnter={() => props.enter(props.pos)} onMouseLeave={() => props.exit(props.pos)} onClick={()=>props.onClick(props.battler!)}>
        <p>{props.battler.name}</p>
        <p>
            {
                props.battler.isDead() ? <span className="icon"><i className="fas fa-skull"></i></span> : null
            }
            {
                props.battler.isWeakState() ? <span className="icon"><i className="fas fa-heart-broken"></i></span> : null
            }
        </p>
    </td>
}

function BattlerDetailView(props: {battler: Battler|undefined}){
    if(props.battler === undefined) {
        return <div className="detail-view"></div>
    }
    let attribute = props.battler.getCurrentAttribute();
    return <div className="detail-view">
        <p>{props.battler.name}
            {
                props.battler.isDead() ? <span className="icon"><i className="fas fa-skull"></i></span> : null
            }
            {
                props.battler.isWeakState() ? <span className="icon"><i className="fas fa-heart-broken"></i></span> : null
            }
        </p>
        
        <p><b>DP:</b> {props.battler.dp}</p>
        {
            attribute === null ? null : 
            <p><b>{ATTRIBUTE_NAME[attribute]}</b> {props.battler.getAttributePoint()}</p>
        }
    </div>
}

export class BattleFieldView extends React.Component<Props, {pos: Position | undefined}>{
    constructor(props: Props) {
        super(props);
        this.state = {
            pos: undefined
        }
    }

    onEnterBattler(pos: Position) {
        this.setState({pos});
    }

    onExitBattler(pos: Position) {
        this.setState((prevState) => prevState.pos === pos ? {pos: undefined} : {pos: prevState.pos});
    }

    render() {
        const battlers: {[key in Position]? : Battler} = this.props.battlers.reduce((state: {[p in Position]? : Battler}, b) => {state[b.position] = b; return state;}, {});
        const col = this.props.isLeft ? [0, 1] : [1, 0];
        let currentBattler = this.state.pos === undefined ? undefined : battlers[this.state.pos];
        return <React.Fragment>
            <table className="battle-field-view">
                <tbody>
                    {
                        [0,1,2].map(x => <tr key={x}>
                            {
                                (x === 0 && !this.props.isLeft) ? <td rowSpan={3} className="frontline"><span>前线</span></td> : null
                            }
                            {
                                col.map(y => <BattlerBriefView pos={(x * 2 + y) as Position} key={y} battler={battlers[(x * 2 + y) as Position]} enter={(b) => this.onEnterBattler(b)} exit={(b) => this.onExitBattler(b)} onClick={this.props.onBattlerClick}/>)
                            }
                            {
                                (x === 0 && this.props.isLeft) ? <td rowSpan={3} className="frontline"><span>前线</span></td> : null
                            }
                        </tr>)
                    }
                </tbody>
            </table>
            <BattlerDetailView battler={currentBattler} />
        </React.Fragment>
    }
}