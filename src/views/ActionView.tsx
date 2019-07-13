import { ActionData } from "../models/ActionData";
import React from "react";


interface Props{
    action: ActionData;
    onClicked: (action: ActionData) => void;
}

export function ActionView(props: Props) {
    return <p className="action" onClick={() => props.onClicked(props.action)}>
        <span className="name">{props.action.name}</span> 
        &nbsp;
        <span className="sp-cost"><b>SP消耗:</b>{props.action.spCost}</span>
    </p>

}