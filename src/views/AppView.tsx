import React from "react";
import { EditView } from "./EditView";
import { SideData } from "../models/Side";
import { ActionData } from "../models/ActionData";
import { BattleView } from "./BattleView";
import { Route } from "react-router-dom";

export class AppView extends React.Component<{}, {sideA: SideData | undefined, sideB: SideData | undefined, actions: ActionData[]}>{

    constructor(props: {}) {
        super(props);
        this.state = {sideA: undefined, sideB: undefined, actions: []};
        this.onComplete = this.onComplete.bind(this);
    }

    onComplete(sideA:SideData, sideB: SideData, actions: ActionData[]) {
        this.setState({sideA: sideA, sideB: sideB, actions: actions});
    }

    render() {
        return<div>
            <Route render={props => <EditView onComplete={this.onComplete} {...props} />} path="/" exact />
            <Route render={props => <BattleView {...props} sideA={this.state.sideA} sideB={this.state.sideB} actionDatas={this.state.actions} />} path="/battle"  />
        </div>
    }
}