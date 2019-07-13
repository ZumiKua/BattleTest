import { ActionData } from "../models/ActionData";
import { ActionView } from "./ActionView";
import React from "react";

interface Props {
    onActionSelectionClosed: () => void;
    actionDatas: ActionData[];
    onActionClicked: (action: ActionData) => void;
}
export function ActionSelectionView(props: Props) {
    return <div className="actions-selection modal is-active">  
        <div className="modal-background"></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">选择行动</p>
                <button className="delete" aria-label="close" onClick={() => props.onActionSelectionClosed()}></button>
            </header>
            <section className="modal-card-body">
                {
                    props.actionDatas.map((action, id) => 
                    <ActionView action={action} key={id} onClicked={() => props.onActionClicked(action)}/>)
                }
            </section>
        </div>
    </div>
}