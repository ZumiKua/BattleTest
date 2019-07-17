import React, { ChangeEvent } from "react";
import { ActionData } from "../models/ActionData";
import { Attribute } from "../models/Attribute";
import { Field } from "./Field";

interface Props{
    action: ActionData;
    onActionChanged: (action: ActionData) => void;
    onActionDeleted: () => void;
}

export class ActionInfoView extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        this.onAttributeChanged = this.onAttributeChanged.bind(this);
        this.onAttributeDamageChanged = this.onAttributeDamageChanged.bind(this);
        this.onHpDamageChanged = this.onHpDamageChanged.bind(this);
        this.onSpCostChanged = this.onSpCostChanged.bind(this);
        this.onNameChanged = this.onNameChanged.bind(this);
        this.onDpRecoveryChanged = this.onDpRecoveryChanged.bind(this);
        this.onSpRecoveryChanged = this.onSpRecoveryChanged.bind(this);
        this.onDefenceIncreaseChanged = this.onDefenceIncreaseChanged.bind(this);
    }

    handleAreaClicked(x: number, y: number) {
        let action = {...this.props.action, targetArea: [...this.props.action.targetArea]};
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
        let action = {...this.props.action, attribute: Number.parseInt(e.target.value)};
        this.props.onActionChanged(action);
    }

    onHpDamageChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = {...this.props.action, hpDamage: Number.parseInt(e.target.value)};
        this.props.onActionChanged(action);
    }

    onSpCostChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = {...this.props.action, spCost: Number.parseInt(e.target.value)};
        this.props.onActionChanged(action);
    }

    onAttributeDamageChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = {...this.props.action, attributeDamage: Number.parseInt(e.target.value)};
        this.props.onActionChanged(action);
    }

    onNameChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = {...this.props.action, name: e.target.value};
        this.props.onActionChanged(action);
    }

    onDpRecoveryChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = {...this.props.action, dpRecovery: Number.parseInt(e.target.value)};
        this.props.onActionChanged(action);
    }

    onSpRecoveryChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = {...this.props.action, spRecovery: Number.parseInt(e.target.value)};
        this.props.onActionChanged(action);
    }

    onDefenceIncreaseChanged(e: ChangeEvent<HTMLInputElement>) {
        let action = {...this.props.action, defenceIncrease: Number.parseInt(e.target.value)};
        this.props.onActionChanged(action);
    }

    getCellClassName(x: number, y: number) {
        return "action-info-target-cell" + (this.isAreaChecked(x,y) ? " checked" : "") + (x === 0 && y === 0 ? " center" : "");
    }

    render() {
        return <div className="action-view">
            <Field label="名称"  type="text" value={this.props.action.name} onChange={this.onNameChanged} />
            <Field label="HP伤害" type="number" value={this.props.action.hpDamage} onChange={this.onHpDamageChanged} />
            <Field label="AP消耗" type="number" value={this.props.action.spCost} onChange={this.onSpCostChanged} />
            <Field label="属性伤害" type="number" value={this.props.action.attributeDamage} onChange={this.onAttributeDamageChanged} />
            <Field label="DP回复" type="number" value={this.props.action.dpRecovery} onChange={this.onDpRecoveryChanged} />
            <Field label="AP回复" type="number" value={this.props.action.spRecovery} onChange={this.onSpRecoveryChanged} />
            <Field label="防御值增加" type="number" value={this.props.action.defenceIncrease} onChange={this.onDefenceIncreaseChanged} />
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
            <div className="is-grouped-right is-grouped field">
                <div className="control">
                    <button className="button is-danger" onClick={this.props.onActionDeleted}>删除</button>
                </div>
            </div>
        </div>
    }
}