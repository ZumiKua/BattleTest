import { Side } from "../models/Side";
import React from "react";
import { Battler } from "../models/Battler";
import { BattleFieldView } from "./BattleFieldView";

interface Props{
    side: Side;
    onBattlerClick: (b: Battler) => void;
    isRed: boolean;
}


export function SideView(props: Props) {
    return <div className={"side-view column is-6" + (props.isRed ? " red" : " blue") }>
        <div>
            <p><b>HP:</b> {props.side.hp}</p>
            <p><b>AP:</b> {props.side.sp}</p>
            <BattleFieldView isLeft={props.isRed} battlers={props.side.battlers} onBattlerClick={props.onBattlerClick}/>
        </div>
    </div>
}

