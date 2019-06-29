import React, { ChangeEvent } from "react";
import { ActionData } from "../models/ActionData";
import { Attribute } from "../models/Attribute";
import { Field } from "./Field";

interface Props{
    action: ActionData;
    onActionChanged: (action: ActionData) => void;
}

export class ActionInfoView extends React.Component<Props> {
    private action: ActionData;
    constructor(props: Props) {
        super(props);
        this.action = {spCost: 0, hpDamage: 0, attribute: Attribute.Fire, attributeDamage: 0, targetArea: [], name: ""};
        this.onAttributeChanged = this.onAttributeChanged.bind(this);
        this.onAttributeDamageChanged = this.onAttributeDamageChanged.bind(this);
        this.onHpDamageChanged = this.onHpDamageChanged.bind(this);
        this.onSpCostChanged = this.onSpCostChanged.bind(this);
        this.onNameChanged = this.onNameChanged.bind(this);
    }

    copyAction(action: ActionData) {
        this.action.spCost = action.spCost;
        this.action.targetArea = action.targetArea;
        this.action.hpDamage = action.hpDamage;
        this.action.attribute = action.attribute;
        this.action.attributeDamage = action.attributeDamage;
        this.action.name = action.name;
        return this.action;
    }

    handleAreaClicked(x: number, y: number) {
        console.log("handleAreaClicked", x, y);
        let action = this.copyAction(this.props.action);
        let existed = action.targetArea.findIndex(v => v[0] === x && v[1] === y);
        if(existed >= 0) {
            action.targetArea.splice(existed, 1);
        }
        else{
            action.targetArea.push([x, y]);
        }
        this.props.onActionChanged(action);
    }

    isAreaChecked(x: number, y: number) {
        return this.props.action.targetArea.find(v => v[0] === x && v[1] === y) !== undefined;
    }

    onAttributeChanged(e: ChangeEvent<HTMLSelectElement>) {
        let action = this.copyAction(this.props.action);
        action.attribute = Number.parseInt(e.target.value);
        this.props.onActionChanged(action);
    }

    onHpDamageChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = this.copyAction(this.props.action);
        action.hpDamage = Number.parseInt(e.target.value);
        this.props.onActionChanged(action);
    }

    onSpCostChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = this.copyAction(this.props.action);
        action.spCost = Number.parseInt(e.target.value);
        this.props.onActionChanged(action);
    }

    onAttributeDamageChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = this.copyAction(this.props.action);
        action.attributeDamage = Number.parseInt(e.target.value);
        this.props.onActionChanged(action);
    }

    onNameChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = this.copyAction(this.props.action);
        action.name = e.target.value;
        this.props.onActionChanged(action);
    }

    getCellClassName(x: number, y: number) {
        return "action-info-target-cell" + (this.isAreaChecked(x,y) ? " checked" : "") + (x === 0 && y === 0 ? " center" : "");
    }

    render() {
        return <div className="action-view">
            <Field label="名称"  type="text" value={this.props.action.name} onChange={this.onNameChanged} />
            <Field label="HP伤害" type="number" value={this.props.action.hpDamage} onChange={this.onHpDamageChanged} />
            <Field label="SP消耗" type="number" value={this.props.action.spCost} onChange={this.onSpCostChanged} />
            <Field label="属性伤害" type="number" value={this.props.action.attributeDamage} onChange={this.onAttributeDamageChanged} />
            <div className="field is-horizontal">
                <div className="field-label is-normal">
                    <label className="label">属性</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select onChange={this.onAttributeChanged} value={this.props.action.attribute}>
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
            <div className="field is-horizontal">
                <div className="field-label is-normal">
                    <label className="label">目标范围</label>
                </div>
                <div className="field-body">
                    <table className="action-info-target-table">
                        <tbody>
                        {
                            [-2,-1,0,1,2].map(x => {
                                return <tr key={x}>
                                    {[-2,-1,0,1,2].map(y => <td className={this.getCellClassName(x,y)} key={y} onClick={(v) => this.handleAreaClicked(x, y, )}></td>)}
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}