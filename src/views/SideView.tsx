import { Side } from "../models/Side";
import { BattlerView } from "./BattlerView";
import React from "react";
import { Battler } from "../models/Battler";

export function SideView(props: {side: Side, onBattlerClick: (b: Battler) => void}) {
    return <div className="side-view">
        <p><b>HP:</b> {props.side.hp}</p>
        <p><b>SP:</b> {props.side.sp}</p>
        {props.side.battlers.map(battler => {
            return <BattlerView battler={battler} key={battler.id} onClick={props.onBattlerClick}/>
        })}
    </div>
}