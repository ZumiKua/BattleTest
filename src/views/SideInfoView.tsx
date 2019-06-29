import React, { ReactNode, ChangeEvent } from "react";
import { BattlerData } from "../models/Battler";
import { BattlerInfoView } from "./BattlerInfoView";
import { SideData } from "../models/Side";
import { Attribute } from "../models/Attribute";
import { Field } from "./Field";

interface Props{
    isLeft: boolean;
    side: SideData;
    onSideChanged: (side: SideData) => void;
}

export class SideInfoView extends React.Component<Props, {}>{

    side: SideData;
    maxBattlerId: number;

    constructor(props : Props) {
        super(props);
        this.handleHpChange = this.handleHpChange.bind(this);
        this.handleSpChange = this.handleSpChange.bind(this);
        this.addBattler = this.addBattler.bind(this);
        this.side = {hp: 0, sp: 0, battlers: []};
        this.maxBattlerId = 0;
    }

    handleHpChange(e: ChangeEvent<HTMLInputElement>) {
        let side = this.copySide(this.props.side);
        side.hp = Number.parseInt(e.target.value);
        this.props.onSideChanged(side);
    }

    handleSpChange(e: ChangeEvent<HTMLInputElement>) {
        let side = this.copySide(this.props.side);
        side.sp = Number.parseInt(e.target.value);
        this.props.onSideChanged(side);
    }

    handleBattlerChanged(id: number, battler: BattlerData) {
        let side = this.copySide(this.props.side);
        let battlers = side.battlers;
        battlers[id] = battler;
        this.props.onSideChanged(side);
    }

    addBattler() {
        let side = this.copySide(this.props.side);
        let battlers = side.battlers;
        let res = {[Attribute.Earth]: 0, [Attribute.Electric]: 0, [Attribute.Fire]: 0, [Attribute.Water]: 0, [Attribute.Wind]: 0};
        let b: BattlerData = {dp: 0, name: "", attributeResistances: res, id: this.maxBattlerId++, position: 0};
        battlers.push(b);
        this.props.onSideChanged(side);
    }

    deleteBattler(id: number) {
        let battlers = this.props.side.battlers.filter(b => b.id !== id);
        this.props.onSideChanged({...this.props.side, battlers});
        

    }

    copySide(side: SideData) : SideData {
        this.side.hp = side.hp;
        this.side.sp = side.sp;
        this.side.battlers = side.battlers;
        return this.side;
    }

    render(): ReactNode{
        return <div className="column">
            <div className="side-info-view">
                <Field label="HP:" className="input" type="number" onChange={this.handleHpChange} value={this.props.side.hp}/>
                <Field label="AP:" className="input" type="number" onChange={this.handleSpChange} value={this.props.side.sp}/>
                <div className="battlers-view">
                    <label className="label">角色：</label>
                    {
                        this.props.side.battlers.map((b, id) => {
                            return <BattlerInfoView isLeft={this.props.isLeft} battler={b} onBattlerChanged={this.handleBattlerChanged.bind(this, id) } onBattlerDeleted={() => this.deleteBattler(b.id)} key={b.id}/>
                        })
                    }
                    <button className="button" onClick={this.addBattler}>添加角色</button>
                </div>
            </div>
            

        </div>
    }
}