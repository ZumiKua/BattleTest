import React from "react";
import { SideInfoView } from "./SideInfoView";
import { SideData } from "../models/Side";
import { ActionData } from "../models/ActionData";
import { ActionInfoView } from "./ActionInfoView";
import { Attribute } from "../models/Attribute";
import { LoadView } from "./LoadView";

const META_ITEM = "_saveMetaItem";

interface SaveData{
    side: SideData;
    side2: SideData;
    actions: ActionData[];
}

interface Props{
    onComplete: (sideA: SideData, sideB: SideData, actions: ActionData[]) => void;
}

export class EditView extends React.Component<Props, {side: SideData, side2: SideData, actions: ActionData[], loadShowing: boolean, saves: string[]}>{
    constructor(props: Props) {
        super(props);
        this.state = {
            side: {hp: 0, sp: 0, battlers: []},
            side2: {hp:0, sp:0, battlers: []},
            actions: [],
            loadShowing: false,
            saves: []
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

    onSave() {
        let savename = window.prompt("存档名称（同名会自动覆盖）", new Date().toLocaleString());
        if(savename === null) {
            return;
        }
        savename = savename.trim();
        if(savename === "") {
            return;
        }
        if(savename === META_ITEM) {
            window.alert("非法名称");
            return;
        }
        const stateString = JSON.stringify({side: this.state.side, side2: this.state.side2, actions: this.state.actions});
        const namesString = localStorage.getItem(META_ITEM);
        let names: string[];
        if(namesString === null) {
            names = [];
        }else{
            names = JSON.parse(namesString) as string[];
        }
        if(names.findIndex(x => x === savename) !== -1) {
            if(window.confirm("存在同名存档，是否覆盖？") === false) {
                return;
            }
        }else{
            names.push(savename);
        }
        localStorage.setItem(META_ITEM, JSON.stringify(names));
        localStorage.setItem(savename, stateString);
    }

    onLoad() {
        const namesString = localStorage.getItem(META_ITEM);
        if(namesString === null) {
            alert("无存档");
            return;
        }
        let names = JSON.parse(namesString) as string[];
        this.setState({
            loadShowing: true,
            saves: names
        });
    }

    onLoadCanceled() {
        this.setState({loadShowing: false})
    }

    onLoadSelected(name: string) { 
        const dataString = localStorage.getItem(name);
        if(dataString === null) {
            alert("读取错误！");
            this.setState({loadShowing: false});
            return;
        }
        const data = JSON.parse(dataString) as SaveData;
        this.setState({
            loadShowing: false,
            side: data.side,
            side2: data.side2,
            actions: data.actions
        });
    }

    render() {
        return <React.Fragment>
            <div className="platform">
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
                <div className="footer-view">
                    <button onClick={this.onComplete}>完成</button>
                    <button onClick={() => this.onSave()}>保存</button>
                    <button onClick={() => this.onLoad()}>读取</button>
                </div>
            </div>
            {
                this.state.loadShowing ? 
                    <LoadView saves={this.state.saves} onClosed={() => this.onLoadCanceled()} onLoad={(name) => this.onLoadSelected(name)} /> : null
            }
        </React.Fragment>
    }

}