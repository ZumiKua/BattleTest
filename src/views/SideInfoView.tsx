import React, { ReactNode, ChangeEvent } from "react";
import { BattlerData, Position } from "../models/Battler";
import { BattlerInfoView } from "./BattlerInfoView";
import { SideData } from "../models/Side";
import { Attribute } from "../models/Attribute";
import { Field } from "./Field";
import { BattlerPositionView } from "./BattlerPositionView";

interface Props{
    isLeft: boolean;
    side: SideData;
    onSideChanged: (side: SideData) => void;
}

export class SideInfoView extends React.Component<Props, {}>{

    maxBattlerId: number;

    constructor(props : Props) {
        super(props);
        this.handleHpChange = this.handleHpChange.bind(this);
        this.handleSpChange = this.handleSpChange.bind(this);
        this.addBattler = this.addBattler.bind(this);
        this.maxBattlerId = 0;
    }

    handleHpChange(e: ChangeEvent<HTMLInputElement>) {
        this.props.onSideChanged({...this.props.side, hp: Number.parseInt(e.target.value)});
    }

    handleSpChange(e: ChangeEvent<HTMLInputElement>) {
        this.props.onSideChanged({...this.props.side, sp: Number.parseInt(e.target.value)});
    }

    handleBattlerChanged(id: number, battler: BattlerData) {
        let battlers = [...this.props.side.battlers];
        const index = battlers.findIndex(b => b.id === id);
        battlers[index] = battler;
        this.props.onSideChanged({...this.props.side, battlers});
    }

    addBattler() {
        let battlers = [...this.props.side.battlers];
        let b: BattlerData = {dp: 0, name: "", id: this.maxBattlerId++, attribute: Attribute.Fire};
        battlers.push(b);
        this.props.onSideChanged({...this.props.side, battlers});
    }

    deleteBattler(id: number) {
        let battlers = this.props.side.battlers.filter(b => b.id !== id);
        const positions: any = this.props.side.battlerPositions;
        for(let key in positions) {
            if(positions[key] === id) {
                positions[key] = undefined;
            }
        }
        this.props.onSideChanged({...this.props.side, battlers, battlerPositions: positions});
    }

    onBattlerPositionChanged(pos: Position, id: number | undefined): void {
        const battlerPositions = {...this.props.side.battlerPositions, [pos]: id};
        console.log(battlerPositions);
        this.props.onSideChanged({...this.props.side, battlerPositions});
    }

    render(): ReactNode{
        return <div className="column">
            <div className="side-info-view">
                <Field label="HP:" className="input" type="number" onChange={this.handleHpChange} value={this.props.side.hp}/>
                <Field label="AP:" className="input" type="number" onChange={this.handleSpChange} value={this.props.side.sp}/>
                <div className="battlers-view">
                    <label className="label">角色：</label>
                    {
                        this.props.side.battlers.map((b) => {
                            return <BattlerInfoView isLeft={this.props.isLeft} battler={b} onBattlerChanged={this.handleBattlerChanged.bind(this, b.id) } onBattlerDeleted={() => this.deleteBattler(b.id)} key={b.id}/>
                        })
                    }
                    <button className="button" onClick={this.addBattler}>添加角色</button>
                </div>
                <BattlerPositionView battlers={this.props.side.battlers} battlerPositions={this.props.side.battlerPositions} isLeft={this.props.isLeft} onBattlerPositionChanged={(p,i) => this.onBattlerPositionChanged(p,i)} />
            </div>
        </div>
    }
    
}