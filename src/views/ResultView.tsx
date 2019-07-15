import { Attack } from "../models/Action";
import { ATTRIBUTE_NAME } from "./AttributeName";
import React from "react";

interface Props{
    result: Attack;
}
export function ResultView(props: Props) {
    let attribute = null;
    if(props.result.attributeDamageResult.attribute !== null) {
        attribute = <React.Fragment>
                <p>附加了 {props.result.attributeDamageResult.attributePointAttached} 点 {ATTRIBUTE_NAME[props.result.attributeDamageResult.attribute]} </p>
                <p>{props.result.attributeDamageResult.knockedIntoWeak ? "打入了弱点状态" : ""} 
                 {props.result.attributeDamageResult.dpDamage > 0 ? `造成了${props.result.attributeDamageResult.dpDamage}点DP伤害` : "" } </p>
            </React.Fragment>;
    }
    let damageMultipiler = null;
    if(props.result.damageMultiplierResult !== null) {
        damageMultipiler = <p>
            伤害提升率上涨了: {props.result.damageMultiplierResult.multiplierAdded}
        </p>
    }
    let dpRcovery = null;
    if(props.result.dpRecoveryResult !== 0) {
        dpRcovery = <p>DP回复了：{props.result.dpRecoveryResult} </p>
    }
    let spRecovery = null;
    if(props.result.spRecoveryResult !== 0) {
        spRecovery = <p>SP回复了：{props.result.spRecoveryResult} </p>
    }
    return <div>
        <p>{props.result.action.user.name} 对 {props.result.target.name} 使用了 {props.result.action.data.name}</p>
        <p>造成了 {props.result.hpDamageResult.hpDamage} 点伤害 {props.result.hpDamageResult.isDead ? "对面已死亡" : ""}</p>
        {attribute}
        {damageMultipiler}
        {dpRcovery}
        {spRecovery}
    </div>
}