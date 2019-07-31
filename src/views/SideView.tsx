import { Side } from "../models/Side";
import React from "react";
import { Battler, Position } from "../models/Battler";
import { BattleFieldView } from "./BattleFieldView";

interface Props{
    onPositionChange: (pos: Position, pos2: Position) => void;
    side: Side;
    onBattlerClick: (b: Battler) => void;
    isRed: boolean;
}


export function SideView(props: Props) {
    return <div className={"side-view column is-6" + (props.isRed ? " red" : " blue") }>
        <div>
            <p><b>HP:</b> {props.side.hp}</p>
            <p><b>AP:</b> {props.side.sp}</p>
            <BattleFieldView isLeft={props.isRed} battlers={props.side.battlers} onBattlerClick={props.onBattlerClick} onPositionChange={props.onPositionChange}/>
        </div>
    </div>
}

