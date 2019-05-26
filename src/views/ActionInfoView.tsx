import React, { SyntheticEvent, MouseEvent, ChangeEvent } from "react";
import { ActionData } from "../models/ActionData";
import { number } from "prop-types";
import { Attribute } from "../models/Attribute";
import { thisTypeAnnotation } from "@babel/types";

interface Props{
    action: ActionData;
    onActionChanged: (action: ActionData) => void;
}

export class ActionInfoView extends React.Component<Props> {
    private action: ActionData;
    constructor(props: Props) {
        super(props);
        this.action = {spCost: 0, hpDamage: 0, attribute: Attribute.Fire, attributeDamage: 0, targetArea: []};
        this.onAttributeChanged = this.onAttributeChanged.bind(this);
        this.onAttributeDamageChanged = this.onAttributeDamageChanged.bind(this);
        this.onHpDamageChanged = this.onHpDamageChanged.bind(this);
        this.onSpCostChanged = this.onSpCostChanged.bind(this);
    }

    copyAction(action: ActionData) {
        this.action.spCost = action.spCost;
        this.action.targetArea = action.targetArea;
        this.action.hpDamage = action.hpDamage;
        this.action.attribute = action.attribute;
        this.action.attributeDamage = action.attributeDamage;
        return this.action;
    }

    handleAreaClicked(x: number, y: number, e: ChangeEvent<HTMLInputElement>) {
        let action = this.copyAction(this.props.action);
        let existed = action.targetArea.findIndex(v => v[0] === x && v[1] === y);
        if(e.target.checked) {
            if(existed < 0) {
                action.targetArea.push([x,y]);
            }
        }else{
            if(existed >= 0) {
                action.targetArea.splice(existed, 1);
            }

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

    render() {
        return <div className="action-view">
            <p>HP伤害: <input type="number" value={this.props.action.hpDamage} onChange={this.onHpDamageChanged} /></p>
            <p>SP消耗: <input type="number" value={this.props.action.spCost} onChange={this.onSpCostChanged} /></p>
            <p>属性伤害: <input type="number" value={this.props.action.attributeDamage} onChange={this.onAttributeDamageChanged} /></p>
            <p>属性:
                <select onChange={this.onAttributeChanged} value={this.props.action.attribute}>
                    <option value={Attribute.Earth}>土</option>
                    <option value={Attribute.Electric}>电</option>
                    <option value={Attribute.Fire}>火</option>
                    <option value={Attribute.Water}>水</option>
                    <option value={Attribute.Wind}>风</option>
                </select>
            </p>
            <div>
                <p>目标范围</p>
                <table>
                    <tbody>
                        {
                            [-2,-1,0,1,2].map(x => {
                                return <tr key={x}>
                                    {[-2,-1,0,1,2].map(y => <td key={y}><input type="checkbox" onChange={this.handleAreaClicked.bind(this, x, y)} checked={this.isAreaChecked(x,y)} /></td>)}
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    }
}