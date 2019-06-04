import React from "react";
import { EditView } from "./EditView";
import { SideData } from "../models/Side";
import { ActionData } from "../models/ActionData";
import { BattleView } from "./BattleView";
import { Attribute } from "../models/Attribute";

export class AppView extends React.Component<{}, {editHidden: boolean, sideViewHidden: boolean, sideA: SideData | undefined, sideB: SideData | undefined, actions: ActionData[]}>{

    constructor(props: {}) {
        super(props);
        //this.state = {editHidden: false, sideViewHidden: true, sideA: undefined, sideB: undefined, actions: []};
        this.state = {
            editHidden: true,
            sideViewHidden: false, 
            sideA: {hp: 100, sp:10, battlers: [{dp: 5, name: "A", id: 1, position: 1, attributeResistances: {0: 0, 1: 0, 2: 2, 3: 0, 4: 0}}]},
            sideB: {hp: 80, sp:6, battlers: [{dp: 2, name: "B", id: 1, position: 2, attributeResistances: {0: 0, 1: 2, 2: 0, 3: 0, 4: 0}}]},
            actions: [{targetArea: [[0, 0], [-1, 0], [-1, 1], [0, 1]], spCost: 2, hpDamage: 20, attribute: Attribute.Fire, attributeDamage: 1, name: "XX"}]
        }
        this.onComplete = this.onComplete.bind(this);
    }

    onComplete(sideA:SideData, sideB: SideData, actions: ActionData[]) {
        this.setState({editHidden: true, sideViewHidden: false, sideA: sideA, sideB: sideB, actions: actions});
    }

    render() {
        return<div>
            <div className={this.state.editHidden ? "hidden" : ""}>
                <EditView onComplete={this.onComplete}  />
            </div>
            {
                this.state.sideViewHidden ? <></> : 
                    <BattleView sideA={this.state.sideA} sideB={this.state.sideB} actions={this.state.actions} />
            }
        </div>
    }
}