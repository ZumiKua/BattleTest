import React from "react";
import { SideInfoView } from "./SideInfoView";
import { SideData } from "../models/Side";
import { ActionData } from "../models/ActionData";
import { ActionInfoView } from "./ActionInfoView";
import { Attribute } from "../models/Attribute";

interface Props{
    onComplete: (sideA: SideData, sideB: SideData, actions: ActionData[]) => void;
}

export class EditView extends React.Component<Props, {side: SideData, side2: SideData, actions: ActionData[]}>{
    constructor(props: Props) {
        super(props);
        this.state = {
            side: {hp: 0, sp: 0, battlers: []},
            side2: {hp:0, sp:0, battlers: []},
            actions: []
        }
        this.handleSideChanged = this.handleSideChanged.bind(this);
        this.handleSide2Changed = this.handleSide2Changed.bind(this);
        this.onAddAction = this.onAddAction.bind(this);
        this.onComplete = this.onComplete.bind(this);
    }

    handleSideChanged(side: SideData) {
        this.setState({side: side});
    }

    handleSide2Changed(side: SideData) {
        this.setState({side2: side});
    }

    onActionChanged(id: number, action: ActionData) {
        this.setState((state) => {
            let arr = state.actions;
            arr[id] = action;
            return {actions: arr};
        })
    }

    onAddAction() {
        this.setState((state) => {
            let arr = state.actions;
            arr.push({hpDamage: 0, spCost: 0, attribute: Attribute.Earth, attributeDamage: 0, targetArea: [], name: ""})
            return {actions: arr};
        })
    }

    onComplete() {
        this.props.onComplete(this.state.side, this.state.side2, this.state.actions);
    }

    render() {
        return <div className="platform">
            <div className="sides-info-view">
                <SideInfoView side={this.state.side} onSideChanged={this.handleSideChanged}/>
                <p className="vs">VS</p>
                <SideInfoView side={this.state.side2} onSideChanged={this.handleSide2Changed} />
            </div>
            <div className="actions-view">
                <p>行动:</p>
                {
                    this.state.actions.map((action, id) => {
                        return <ActionInfoView action={action} onActionChanged={this.onActionChanged.bind(this, id)} key={id}/>
                    })
                }
                <button onClick={this.onAddAction}>+</button>
            </div>
            <div className="complete-view">
                <button onClick={this.onComplete}>完成</button>
            </div>
        </div>
    }

}