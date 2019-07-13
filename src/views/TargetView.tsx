import { Battler, Position, FlatPosToXY, XYPosToFlat } from "../models/Battler";
import React from "react";

interface Props{
    battlersLeft: Battler[];
    battlersRight: Battler[];
    areas: [number, number][];
    onTargetSelected: (pos: Position, isLeft: boolean) => void;
    onClose: () => void;
}

function BattlerCell(props: {onClick: () => void, onEnter: () => void, onExit: () => void, pos: Position, highlighted: boolean, name: string}) {
    return <td onMouseEnter={() => props.onEnter()} onMouseLeave={() => props.onExit()} className={props.highlighted ? "highlighted" : ""} onClick={() => props.onClick()}>{props.name}</td>
}

export class TargetView extends React.Component<Props, {hoveredPosition: {isLeft: boolean, pos: Position} | undefined}> {
    constructor(props: Props) {
        super(props);
        this.state = {hoveredPosition: undefined};
        this.onTargetSelected = this.onTargetSelected.bind(this);
    }

    onTargetSelected(pos: Position, isLeft: boolean) {
        this.props.onTargetSelected(pos, isLeft);
    }

    onEnter(isLeft: boolean, pos: Position) {
        this.setState({hoveredPosition: {isLeft, pos}});
    }

    onExit(isLeft: boolean, pos: Position) {
        this.setState((prevState) => {
            if(prevState.hoveredPosition !== undefined && prevState.hoveredPosition.isLeft === isLeft && prevState.hoveredPosition.pos === pos) {
                return {hoveredPosition: undefined};
            }
            else{
                return {hoveredPosition: prevState.hoveredPosition};
            }
        });
    }

    render() {
        let highlighted : Position[] = [];
        if(this.state.hoveredPosition !== undefined) {
            let [bx,by] = FlatPosToXY(this.state.hoveredPosition.pos);
            this.props.areas.forEach((pos) => {
                let x = bx + pos[0];
                let y = by + pos[1];
                if(x >= 0 && x <= 2 && y >= 0 && y <= 1) {
                    highlighted.push(x * 2 + y as Position);
                }
            })
        }
        let map = Array(6).fill(false);
        highlighted.forEach(v => map[v] = true);
        let leftBattlersMap: (Battler|null)[] = Array(6).fill(null);
        let rightBattlersMap: (Battler|null)[] = Array(6).fill(null);
        this.props.battlersLeft.forEach(b => leftBattlersMap[b.position] = b);
        this.props.battlersRight.forEach(b => rightBattlersMap[b.position] = b);
        return <div className="modal target-view is-active">
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">选择目标</p>
                        <button className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                        <table className="target-view-table">
                            <tbody>
                                {
                                    [0,1,2].map(x => 
                                        <tr key={x}>
                                            {
                                                [0,1].map(y => {
                                                    let pos = XYPosToFlat(x as 0|1|2, y as 0|1);
                                                    let battler = leftBattlersMap[pos];
                                                    let name = battler === null ? "" : battler.name;
                                                    let isHighlightedLeft = this.state.hoveredPosition === undefined ? false : this.state.hoveredPosition.isLeft;
                                                    let isHighlighted = isHighlightedLeft ? map[pos] : false;
                                                    return <BattlerCell key={y} onClick={()=>this.onTargetSelected(pos, true)} onEnter={() => this.onEnter(true, pos)} onExit={() => this.onExit(true, pos)} pos={pos} name={name} highlighted={isHighlighted}/>
                                                })
                                            }
                                            {
                                                x === 0 ? <td rowSpan={3} className="target-view-frontline">前线</td> : null
                                            }
                                            {
                                                [1,0].map(y => {
                                                    let pos = XYPosToFlat(x as 0|1|2, y as 0|1);
                                                    let battler = rightBattlersMap[pos];
                                                    let name = battler === null ? "" : battler.name;
                                                    let isHighlightedRight = this.state.hoveredPosition === undefined ? false : !this.state.hoveredPosition.isLeft;
                                                    let isHighlighted = isHighlightedRight ? map[pos] : false;
                                                    return <BattlerCell key={y} onClick={()=>this.onTargetSelected(pos, false)} onEnter={() => this.onEnter(false, pos)} onExit={() => this.onExit(false, pos)} pos={pos} name={name} highlighted={isHighlighted}/>
                                                })
                                            }
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
    }
}