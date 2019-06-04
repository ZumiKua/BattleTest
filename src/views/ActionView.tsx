import { ActionData } from "../models/ActionData";
import React from "react";


interface Props{
    action: ActionData;
    onClicked: (action: ActionData) => void;
}

export function ActionView(props: Props) {
    return <p onClick={() => props.onClicked(props.action)}>
        <span>{props.action.name}</span> 
        &nbsp;
        <span>{props.action.spCost}</span>
    </p>

}