import { Action } from "../models/Action";
import React from "react";

interface Props{
    actions: Action[];
    onActionDeleted: (id: number) => void;
}
export function ActionRecordsView(props: Props) {
    return <div className="action-records">
        {
            props.actions.map(action => <p key={action.id} className="action-record">
                <span>{action.user.name}</span>
                <span className="action-record-action-use">使用了</span>
                <span className="action-record-action-name">{action.data.name}</span> 
                <button className="delete action-record-delete" onClick={e=>{e.preventDefault(); props.onActionDeleted(action.id)} }>X</button>
            </p>)
        }
    </div>
}