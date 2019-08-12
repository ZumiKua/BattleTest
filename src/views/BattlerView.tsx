import { Battler } from "../models/Battler";
import { Attribute } from "../models/Attribute";
import React from "react";

export function BattlerView(props: {battler: Battler, onClick: (battler: Battler) => void}){
    const attribute: Attribute | null = props.battler.attribute;
    let attributeName : string = "无";
    if(attribute !== null){
        switch(attribute) {
            case Attribute.Fire:
                attributeName = "火";
                break;
            case Attribute.Water:
                attributeName = "水";
                break;
            case Attribute.Wind:
                attributeName = "风";
                break;
            case Attribute.Electric:
                attributeName = "电";
                break;
            case Attribute.Earth:
                attributeName = "土";
                break;
        }
    }
    return <p className="battler" onClick={(e) => props.onClick(props.battler)}>
        <b>{props.battler.name}</b> &nbsp;
        <b>DP: </b> {props.battler.dp} | &nbsp;
        <b>属性：</b>{attributeName}
        <span className={props.battler.isWeakState() ? "" : "hidden"}>| 弱点</span>
        <span className={props.battler.isDead() ? "" : "hidden"}>| 死亡</span>
    </p>
}