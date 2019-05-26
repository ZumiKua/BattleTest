import React, { ChangeEvent } from "react";
import { Attribute } from "../models/Attribute";
import { BattlerData } from "../models/Battler";

const ATTRIBUTE_NAME = {
    [Attribute.Earth]: "土",
    [Attribute.Electric]: "电",
    [Attribute.Fire]: "火",
    [Attribute.Water]: "水",
    [Attribute.Wind]: "风"
}

export class BattlerInfoView extends React.Component<{battler: BattlerData, onBattlerChanged: (battler: BattlerData) => void}, {}>{
    constructor(props: {battler: BattlerData, onBattlerChanged: (battler: BattlerData) => void}) {
        super(props);
        this.handleDpChange = this.handleDpChange.bind(this);
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        
    }

    handleDpChange(e: ChangeEvent<HTMLInputElement>) {
        let battler = this.copyBattler(this.props.battler);
        battler.dp = Number.parseInt(e.target.value);
        this.props.onBattlerChanged(battler);
    }

    handlePositionChange(e: ChangeEvent<HTMLInputElement>) {
        let pos = Number.parseInt(e.target.value);
        if(pos >= 0 && pos < 6) {
            let battler = this.copyBattler(this.props.battler);
            battler.position = pos as any;
            this.props.onBattlerChanged(battler);
        }
    }

    handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        let battler = this.copyBattler(this.props.battler);
        battler.name = e.target.value;
        this.props.onBattlerChanged(battler);
    }

    handleAttributeChange(attribute: Attribute, e: ChangeEvent<HTMLInputElement>) {
        let battler = this.copyBattler(this.props.battler);
        battler.attributeResistances[attribute] = Number.parseInt(e.target.value);
        this.props.onBattlerChanged(battler);
    }

    copyBattler(battler: BattlerData) : BattlerData{
        return {dp: battler.dp, id: battler.id, name: battler.name, position: battler.position, attributeResistances: battler.attributeResistances};
    }

    render() {
        return <div className="battler-info">
            <p>DP: <input type="number" onChange={this.handleDpChange} value={this.props.battler.dp} /></p>
            <p>位置: <input type="number" onChange={this.handlePositionChange} value={this.props.battler.position} min="0" max="5"/></p>
            <p>名称: <input type="text" onChange={this.handleNameChange} value={this.props.battler.name}/></p>
            <div>
                <p>抗性</p>
                {
                    [Attribute.Earth, Attribute.Electric, Attribute.Fire, Attribute.Water, Attribute.Wind].map((attribute: Attribute, i: number) => {
                        return <p key={i}>{ATTRIBUTE_NAME[attribute]}<input value={this.props.battler.attributeResistances[attribute]} onChange={this.handleAttributeChange.bind(this, attribute)}/></p>
                    })
                }
            </div>
        </div>
    }

    
}