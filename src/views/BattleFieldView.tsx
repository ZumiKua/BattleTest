import React, { DragEvent } from "react";
import { Battler, Position } from "../models/Battler";
import {ATTRIBUTE_NAME, ICON_NAME} from "./AttributeName";

interface Props{
    battlers: Battler[];
    isLeft: boolean;
    onBattlerClick: (b: Battler) => void;
    onPositionChange: (pos: Position, pos2: Position) => void;
}

interface BriefProps{
    pos: Position;
    battler: Battler | undefined;
    enter: (pos: Position) => void;
    exit: (pos: Position) => void;
    onClick: (b: Battler) => void;
    isLeft: boolean;
    onPositionChange: (pos: Position, pos2: Position) => void;
}

function BattlerBriefView(props: BriefProps){
    const dataTransferKey = props.isLeft ? "btest/battler_left" : "btest/battler_right";
    const onDragStart = (e: DragEvent) => {
        if(props.battler !== undefined) {
            e.dataTransfer.setData(dataTransferKey, props.pos.toString());
        }
        else{
            e.preventDefault();
        }
    }
    const onDragDrop = (e: DragEvent) => {
        const pos = parseInt(e.dataTransfer.getData(dataTransferKey)) as Position;
        if(pos === props.pos) {
            return;
        }
        e.preventDefault();
        props.onPositionChange(pos, props.pos);
    }

    const onDragOver = (e: DragEvent) => {
        if(e.dataTransfer.types.indexOf(dataTransferKey) === -1) {
            return;
        }
        e.dataTransfer.dropEffect = "move";
        e.preventDefault();
    }
    const dragObj = {draggable:true, onDragStart, onDrop: onDragDrop, onDragOver };
    if(props.battler === undefined) {
        return <td onMouseEnter={() => props.enter(props.pos)} onMouseLeave={() => props.exit(props.pos)} {...dragObj} ></td>
    }
    let attrIcon = null;
    
    const attr = props.battler.attribute;
    if(attr !== null) {
        attrIcon = <span className="icon"><i className={"fas " + ICON_NAME[attr]}></i></span>
    }

    const dp_classname = props.battler.dp === props.battler.maxDp ? " maxed" : ""

    return <td onMouseEnter={() => props.enter(props.pos)} onMouseLeave={() => props.exit(props.pos)} onClick={()=>props.onClick(props.battler!)} {...dragObj}>
        <p className="battle-brief-view-name">{props.battler.name}</p>
        <p className={"battle-brief-view-dp" + dp_classname}>{props.battler.dp}</p>
        <p className="battle-brief-view-icons">
            {
                props.battler.isDead() ? <span className="icon"><i className="fas fa-skull"></i></span> : null
            }
            {
                props.battler.isWeakState() ? <span className="icon"><i className="fas fa-heart-broken"></i></span> : null
            }
            {
                attrIcon
            }
            
        </p>
        
    </td>
}

function BattlerDetailView(props: {battler: Battler|undefined}){
    if(props.battler === undefined) {
        return <div className="detail-view"></div>
    }
    let attribute = props.battler.attribute;
    console.log("BattlerDetailView", props.battler);
    return <div className="detail-view">
        <p>{props.battler.name}
            {
                props.battler.isDead() ? <span className="icon"><i className="fas fa-skull"></i></span> : null
            }
            {
                props.battler.isWeakState() ? <span className="icon"><i className="fas fa-heart-broken"></i></span> : null
            }
        </p>
        
        <p><b>DP:</b> {props.battler.dp} / {props.battler.maxDp}</p>
        <p><b>抗:</b>{props.battler.defence}</p>
        {
            attribute === null ? null : 
            <p><b>{ATTRIBUTE_NAME[attribute]}</b></p>
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
                                col.map(y => <BattlerBriefView 
                                    pos={(x * 2 + y) as Position} 
                                    key={y} 
                                    battler={battlers[(x * 2 + y) as Position]} 
                                    enter={(b) => this.onEnterBattler(b)} 
                                    exit={(b) => this.onExitBattler(b)} 
                                    onClick={this.props.onBattlerClick} isLeft={this.props.isLeft} 
                                    onPositionChange={this.props.onPositionChange}
                                />)
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