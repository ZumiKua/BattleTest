import React, { ReactNode, ChangeEvent } from "react";
import { BattlerData } from "../models/Battler";
import { BattlerInfoView } from "./BattlerInfoView";
import { SideData } from "../models/Side";
import { Attribute } from "../models/Attribute";

export class SideInfoView extends React.Component<{side: SideData, onSideChanged: (side: SideData) => void}, {}>{

    side: SideData;

    constructor(props : {side: SideData, onSideChanged: (side: SideData) => void}) {
        super(props);
        this.handleHpChange = this.handleHpChange.bind(this);
        this.handleSpChange = this.handleSpChange.bind(this);
        this.addBattler = this.addBattler.bind(this);
        this.side = {hp: 0, sp: 0, battlers: []};
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
        let b: BattlerData = {dp: 0, name: "", attributeResistances: res, id: battlers.length, position: 0};
        battlers.push(b);
        this.props.onSideChanged(side);
    }

    copySide(side: SideData) : SideData {
        this.side.hp = side.hp;
        this.side.sp = side.sp;
        this.side.battlers = side.battlers;
        return this.side;
    }

    render(): ReactNode{
        return <div>
            <p>HP: <input type="number" onChange={this.handleHpChange} value={this.props.side.hp}/> </p>
            <p>SP: <input type="number" onChange={this.handleSpChange} value={this.props.side.sp}/></p>
            <div>
                <p>角色：</p>
                {
                    this.props.side.battlers.map((b, id) => {
                        return <BattlerInfoView battler={b} onBattlerChanged={this.handleBattlerChanged.bind(this, id) } key={b.id}/>
                    })
                }
                <button onClick={this.addBattler}>+</button>
            </div>

        </div>
    }
}