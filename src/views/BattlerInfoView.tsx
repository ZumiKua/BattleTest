import React, { ChangeEvent } from "react";
import { Attribute } from "../models/Attribute";
import { BattlerData, Position } from "../models/Battler";
import { Field } from "./Field";
import { PositionSelectionView } from "./PositionSelectionView";
import {ATTRIBUTE_NAME, ICON_NAME} from "./AttributeName";

interface Props{
    isLeft: boolean;
    battler: BattlerData;
    onBattlerChanged: (battler: BattlerData) => void;
    onBattlerDeleted: () => void
}

export class BattlerInfoView extends React.Component<Props, {}>{
    constructor(props: Props) {
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

    handlePositionChange(pos: Position) {
        let battler = {...this.props.battler, position: pos};
        this.props.onBattlerChanged(battler);
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
        return <div className="battler-info-view">
            <Field label="DP:" type="number" onChange={this.handleDpChange} value={this.props.battler.dp} />
            <div className="field is-horizontal">
                <div className="field-label is-normal">
                    <label className="label">位置</label>
                </div>
                <div className="field-body">
                    <PositionSelectionView isLeft={this.props.isLeft} currentPosition={this.props.battler.position} onPositionChange={pos => this.handlePositionChange(pos)}/>
                </div>
            </div>
            <Field label="名称:" type="text" onChange={this.handleNameChange} value={this.props.battler.name} />
        
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">抗性</label>
                </div>
                <div className="field-body">
                    {
                        [Attribute.Earth, Attribute.Electric, Attribute.Fire, Attribute.Water, Attribute.Wind].map((attribute: Attribute) => {
                            return <div className="field" key={attribute}>
                                <p className="control has-icons-left">
                                    <input type="number" className="input" value={this.props.battler.attributeResistances[attribute]} onChange={this.handleAttributeChange.bind(this, attribute)} placeholder={ATTRIBUTE_NAME[attribute]}/>
                                    <span className="icon is-small is-left">
                                        <i className={"fas " + ICON_NAME[attribute]}></i>
                                    </span>
                                </p>
                            </div>
                        })
                    }
                </div>
            </div>
        
            <div className="is-grouped-right is-grouped field">
                <div className="control">
                    <button className="button is-danger" onClick={this.props.onBattlerDeleted}>删除</button>
                </div>
            </div>
        </div>
    }

    
}