import { Battler, Position, XYPosToFlat } from "../models/Battler";
import React from "react";

interface Props{
    battlersLeft: Battler[];
    battlersRight: Battler[];
    onTargetSelected: (selected: {left: Position[], right: Position[]}) => void;
    onClose: () => void;
}

function BattlerCell(props: {onClick: () => void, pos: Position, highlighted: boolean, name: string}) {
    return <td className={props.highlighted ? "highlighted" : ""} onClick={() => props.onClick()}>{props.name}</td>
}

export class TargetView extends React.Component<Props, {selectedPosition: {left: {[p in Position] : boolean}, right: {[p in Position]: boolean}}}> {
    constructor(props: Props) {
        super(props);
        this.state = {selectedPosition: {left: {0: false, 1: false, 2: false, 3: false, 4: false, 5: false}, right: {0: false, 1: false, 2: false, 3: false, 4: false, 5: false}}};
        this.onTargetSelected = this.onTargetSelected.bind(this);
    }

    onTargetSelected(pos: Position, isLeft: boolean) {
        this.setState(prevState => {
            {
                const oldPos = {left: {...prevState.selectedPosition.left}, right: {...prevState.selectedPosition.right}};
                if(isLeft) {
                    oldPos.left[pos] = !oldPos.left[pos];
                }
                else{
                    oldPos.right[pos] = !oldPos.right[pos];
                }
                return {selectedPosition: oldPos}
            }
        });
    }

    onConfirm() {
        const convert = (v: {[p in Position]: boolean}) => Object.entries(v).filter(([x,y]) => y).map(([key, _]) => Number.parseInt(key));
        const left = convert(this.state.selectedPosition.left) as Position[];
        const right = convert(this.state.selectedPosition.right) as Position[];
        this.props.onTargetSelected({left, right});
    }

    render() {
        let leftBattlersMap: (Battler|null)[] = Array(6).fill(null);
        let rightBattlersMap: (Battler|null)[] = Array(6).fill(null);
        this.props.battlersLeft.forEach(b => leftBattlersMap[b.position] = b);
        this.props.battlersRight.forEach(b => rightBattlersMap[b.position] = b);
        return <div className="modal target-view is-active">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">选择目标</p>
                        <button className="delete" aria-label="close" onClick={()=>this.props.onClose()}></button>
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
                                                    let isHighlighted = this.state.selectedPosition.left[pos];
                                                    return <BattlerCell key={y} onClick={()=>this.onTargetSelected(pos, true)} pos={pos} name={name} highlighted={isHighlighted}/>
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
                                                    let isHighlighted = this.state.selectedPosition.right[pos];
                                                    return <BattlerCell key={y} onClick={()=>this.onTargetSelected(pos, false)} pos={pos} name={name} highlighted={isHighlighted}/>
                                                })
                                            }
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={() => this.onConfirm()}>确认</button>
                        <button className="button" onClick={() => this.props.onClose()}>取消</button>
                    </footer>
                </div>
            </div>
    }
}