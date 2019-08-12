import React, { ChangeEvent } from "react";
import { Attribute } from "../models/Attribute";
import { BattlerData } from "../models/Battler";
import { Field } from "./Field";

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
        this.handleNameChange = this.handleNameChange.bind(this);
        this.onAttributeChanged = this.onAttributeChanged.bind(this);
    }

    handleDpChange(e: ChangeEvent<HTMLInputElement>) {
        this.props.onBattlerChanged({...this.props.battler, dp: Number.parseInt(e.target.value)});
    }

    handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        this.props.onBattlerChanged({...this.props.battler, name: e.target.value});
    }

    onAttributeChanged(e: ChangeEvent<HTMLSelectElement>) {
        this.props.onBattlerChanged({...this.props.battler, attribute: Number.parseInt(e.target.value)})
    }

    render() {
        return <div className="battler-info-view">
            <Field label="DP:" type="number" onChange={this.handleDpChange} value={this.props.battler.dp} />
            <Field label="名称:" type="text" onChange={this.handleNameChange} value={this.props.battler.name} />
        
            <div className="field is-horizontal">
                <div className="field-label is-normal">
                    <label className="label">属性:</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select onChange={this.onAttributeChanged} value={this.props.battler.attribute}>
                                    <option value={Attribute.Earth}>土</option>
                                    <option value={Attribute.Electric}>电</option>
                                    <option value={Attribute.Fire}>火</option>
                                    <option value={Attribute.Water}>水</option>
                                    <option value={Attribute.Wind}>风</option>
                                </select> 
                            </div>
                        </div>
                    </div>
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