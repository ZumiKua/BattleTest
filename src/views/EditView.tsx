import React from "react";
import { SideInfoView } from "./SideInfoView";
import { SideData } from "../models/Side";
import { ActionData } from "../models/ActionData";
import { ActionInfoView } from "./ActionInfoView";
import { Attribute } from "../models/Attribute";
import { LoadView } from "./LoadView";
import { Link } from "react-router-dom";

const META_ITEM = "_saveMetaItem_V5";
//NO MIGRATE FOR V4
const META_ITEM_V3 = "_saveMetaItem_V3";
const META_ITEM_V2 = "_saveMetaItem_V2";

interface SaveData{
    side: SideData;
    side2: SideData;
    actions: ActionData[];
}

interface Props{
    onComplete: (sideA: SideData, sideB: SideData, actions: ActionData[]) => void;
}

interface Action {
    data: ActionData;
    id: number;
}

interface State{
    side: SideData;
    side2: SideData;
    actions: Action[];
    loadShowing: boolean;
    saves: string[];
    currentPage: "sides" | "actions";
}

export class EditView extends React.Component<Props, State>{

    maxActionId: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            side: {hp: 0, sp: 0, battlers: [], battlerPositions: {}},
            side2: {hp:0, sp:0, battlers: [], battlerPositions: {}},
            actions: [],
            loadShowing: false,
            saves: [],
            currentPage: "sides" 
        }
        this.maxActionId = 0;
        this.handleSideChanged = this.handleSideChanged.bind(this);
        this.handleSide2Changed = this.handleSide2Changed.bind(this);
        this.onAddAction = this.onAddAction.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.migrateSaveV2_TO_V3();
        this.migrateSaveV3_TO_V4();
    }

    handleSideChanged(side: SideData) {
        this.setState({side: side});
    }

    handleSide2Changed(side: SideData) {
        this.setState({side2: side});
    }

    onActionChanged(id: number, action: ActionData) {
        this.setState((state) => {
            let arr = [...state.actions];
            const index = arr.findIndex(v=> v.id === id);
            arr[index] = {...arr[index], data: action};
            return {actions: arr};
        })
    }

    onAddAction() {
        this.setState((state) => {
            let arr = [...state.actions];
            arr.push({id: this.maxActionId++, data: {hpDamage: 0, spCost: 0, attribute: Attribute.Earth, name: "", spRecovery: 0, dpRecovery: 0, defenceIncrease: 0, weakStateRecover: false}});
            return {actions: arr};
        })
    }

    onRemoveAction(id: number) {
        this.setState((state) => {
            const actions = [...state.actions];
            const index = actions.findIndex(v => v.id === id);
            if(index !== -1) {
                actions.splice(index, 1);
            }
            return {actions};
        });
    }

    onComplete() {
        this.props.onComplete(this.state.side, this.state.side2, this.state.actions.map(v=>v.data));
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
        if(savename === META_ITEM || savename === META_ITEM_V2) {
            window.alert("非法名称");
            return;
        }
        //todo remove actions id.
        const stateString = JSON.stringify({side: this.state.side, side2: this.state.side2, actions: this.state.actions.map(v => v.data)});
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

    private migrateSave(oldSaveItem: string, newSaveItem: string, convert: (data:any) => any) {
        const oldNameString = localStorage.getItem(oldSaveItem);
        if(oldNameString === null) {
            return;
        }
        const oldSaves = JSON.parse(oldNameString) as string[];
        const newSave = [];
        for (let save of oldSaves) {
            const saveString = localStorage.getItem(save);
            if(saveString === null) {
                continue;
            }
            let saveData = JSON.parse(saveString) as any;
            saveData = convert(saveData);
            newSave.push(save);
            localStorage.setItem(save, JSON.stringify(saveData));
        }
        localStorage.removeItem(oldSaveItem);
        const newNameString = localStorage.getItem(newSaveItem);
        let newNames: string[] = [];
        if(newNameString !== null) {
            newNames = JSON.parse(newNameString) as string[];
        }
        for (let save of newSave) {
            if(newNames.indexOf(save) === -1) {
                newNames.push(save);
            }
        }
        localStorage.setItem(META_ITEM, JSON.stringify(newNames));
    }

    private migrateSaveV3_TO_V4() {
        const convertSide = (side: any) => {
            let v: any = {};
            for(let b of side.battlers){
                v[b["position"]] = b.id;
                delete b["position"];
            }
            side.battlerPositions = v;
        }
        this.migrateSave(META_ITEM_V3, META_ITEM, (oldSave)=> {
            convertSide(oldSave["side"]);
            convertSide(oldSave["side2"]);
            return oldSave;
        });
    }

    private migrateSaveV2_TO_V3() {
        this.migrateSave(META_ITEM_V2, META_ITEM_V3, (oldSave) => {
            oldSave.actions.forEach((action: any) => {
                delete action["targetArea"];
            })
            return oldSave;
        })
    }

    onLoad() {
        const namesString = localStorage.getItem(META_ITEM);
        if(namesString === null) {
            alert("无存档");
            return;
        }
        let names = JSON.parse(namesString) as string[];
        if(names.length === 0) {
            alert("无存档");
            return;
        }
        this.setState({
            loadShowing: true,
            saves: names
        });
    }

    onLoadCanceled() {
        this.setState({loadShowing: false})
    }

    onDeleteSave(name: string) {
        const nameString = localStorage.getItem(META_ITEM);
        if(nameString === null) {
            alert("读取错误！");
            this.setState({loadShowing: false});
            return;
        }
        let names = JSON.parse(nameString) as string[];
        const index = names.indexOf(name);
        if(index === -1) {
            alert("读取错误！");
            this.setState({loadShowing: false});
            return;
        }
        names.splice(index, 1);

        localStorage.setItem(META_ITEM, JSON.stringify(names));
        localStorage.removeItem(name);

        if(names.length === 0) {
            this.setState({
                loadShowing: false,
                saves: names
            });
        }
        else {
            this.setState({
                loadShowing: true,
                saves: names
            });
        }
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
            actions: data.actions.map(v => ({id: this.maxActionId++, data: v}))
        });
    }

    render() {
        return <React.Fragment>
            <div className="container">
                <div className="tabs">
                    <ul>
                        <li className={this.state.currentPage === "sides" ? "is-active" : ""}>
                            <a onClick={(e) => {e.preventDefault(); this.setState({currentPage: "sides"});}}>角色</a>
                        </li>
                        <li className={this.state.currentPage === "actions" ? "is-active" : ""}>
                            <a onClick={(e) => {e.preventDefault(); this.setState({currentPage: "actions"});}}>行为</a>
                        </li>
                    </ul>
                </div>
                {
                    this.state.currentPage === "sides" ? 
                        <div className="sides-view">
                            <div className="columns edit-view-troop-headers">
                                <div className="column edit-view-troop-header red"><p>红方</p></div>
                                <div className="column edit-view-troop-header blue"><p>蓝方</p></div>
                            </div>
                            
                            <div className="columns side-info-views">
                                <SideInfoView side={this.state.side} onSideChanged={this.handleSideChanged} isLeft={true}/>
                                
                                <SideInfoView side={this.state.side2} onSideChanged={this.handleSide2Changed} isLeft={false}/>
                            </div>
                        </div> 
                    :
                         null
                }
                

                {
                    this.state.currentPage === "actions" ? 
                        <div className="actions-view">
                            {
                                this.state.actions.map((action) => {
                                    return <ActionInfoView action={action.data} onActionChanged={this.onActionChanged.bind(this, action.id)} key={action.id} onActionDeleted={() => this.onRemoveAction(action.id)}/>
                                })
                            }
                            <div className="field">
                                <button className="button" onClick={this.onAddAction}>添加</button>
                            </div>
                            
                        </div>
                    :
                        null
                }
                
                <div className="footer-view field is-grouped">
                    <p className="control">
                        <Link className="button is-primary" to="/battle" onClick={this.onComplete}>完成</Link>
                    </p>
                    <p className="control">
                        <button className="button" onClick={() => this.onSave()}>保存</button>
                    </p>
                    <p className="control">
                        <button className="button" onClick={() => this.onLoad()}>读取</button>
                    </p>
                    
                </div>
            </div>
            {
                this.state.loadShowing ? 
                    <LoadView saves={this.state.saves} onClosed={() => this.onLoadCanceled()} onLoad={(name) => this.onLoadSelected(name)} onDelete={(name) => this.onDeleteSave(name)}/> : null
            }
        </React.Fragment>
    }

}