import { ActionData } from "../models/ActionData";
import { ActionView } from "./ActionView";
import React from "react";

interface Props {
    onActionSelectionClosed: () => void;
    actionDatas: ActionData[];
    onActionClicked: (action: ActionData) => void;
}
export function ActionSelectionView(props: Props) {
    return <div className="actions modal"> 
        <p className="modal-header">
            <span className="modal-title">选择行动：</span>
            <button className="modal-close anchor-like-button" onClick={() => props.onActionSelectionClosed()}>[X]</button>
        </p>
        {
            props.actionDatas.map((action, id) => 
                <ActionView action={action} key={id} onClicked={() => props.onActionClicked(action)}/>)
        }
    </div>
}