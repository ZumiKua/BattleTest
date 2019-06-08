import { ActionData } from "../models/ActionData";
import React from "react";


interface Props{
    action: ActionData;
    onClicked: (action: ActionData) => void;
}

export function ActionView(props: Props) {
    return <p onClick={() => props.onClicked(props.action)} className="action">
        <span>{props.action.name}</span> 
        &nbsp;
        <span><b>SP消耗:</b>{props.action.spCost}</span>
    </p>

}