import React from "react";
import { EditView } from "./EditView";
import { SideView } from "./SideView";
import { Side, SideData } from "../models/Side";
import { ActionData } from "../models/ActionData";

export class AppView extends React.Component<{}, {editHidden: boolean, sideViewHidden: boolean}>{

    sideA: Side | null;
    sideB: Side | null;

    constructor(props: {}) {
        super({});
        this.state = {editHidden: false, sideViewHidden: true};
        this.sideA = null;
        this.sideB = null;
        this.onComplete = this.onComplete.bind(this);
    }

    onComplete(sideA:SideData, sideB: SideData, actions: ActionData[]) {
        this.sideA = new Side(sideA);
        this.sideB = new Side(sideB);
        this.sideA.setOpponent(this.sideB);
        this.sideB.setOpponent(this.sideA);
        this.setState({editHidden: true, sideViewHidden: false});
    }

    render() {
        return<div>
            <div className={this.state.editHidden ? "hidden" : ""}>
                <EditView onComplete={this.onComplete}  />
            </div>
            {
                this.state.sideViewHidden ? <></> : 
                    <div>
                        <SideView side={this.sideA as Side} />
                        <SideView side={this.sideB as Side} />
                    </div>
                    
            }
        </div>
    }
}