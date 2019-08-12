import { Attack } from "../models/Action";
import React from "react";

interface Props{
    result: Attack;
}
export function ResultView(props: Props) {
    let attribute = null;
    if(props.result.attributeDamageResult !== null) {
        attribute = <React.Fragment>
                <p>{props.result.attributeDamageResult.knockedIntoWeak ? "打入了弱点状态" : ""} 
                 {props.result.attributeDamageResult.dpDamage > 0 ? `造成了${props.result.attributeDamageResult.dpDamage}点DP伤害` : "" } </p>
                 {props.result.attributeDamageResult.damageMultipiler === null ? null : <p>伤害提升率上涨了: {props.result.attributeDamageResult.damageMultipiler.multiplierAdded}</p>}
            </React.Fragment>;
    }
    let dpRcovery = null;
    if(props.result.dpRecoveryResult !== 0) {
        dpRcovery = <p>DP回复了：{props.result.dpRecoveryResult} </p>
    }
    let spRecovery = null;
    if(props.result.spRecoveryResult !== 0) {
        spRecovery = <p>SP回复了：{props.result.spRecoveryResult} </p>
    }
    let defenceIncreasement = null;
    if(props.result.defenceIncreaseResult !== 0) {
        defenceIncreasement = <p>防御上涨了：{props.result.defenceIncreaseResult}</p>
    }
    return <div className="result-view">
        <p>{props.result.action.user.name} 对 {props.result.target.name} 使用了 {props.result.action.data.name}</p>
        <p>消耗了{props.result.hpDamageResult.defended}点防御</p>
        <p>造成了 {props.result.hpDamageResult.hpDamage} 点伤害 {props.result.hpDamageResult.isDead ? "对面已死亡" : ""}</p>
        {attribute}
        {dpRcovery}
        {spRecovery}
        {defenceIncreasement}
    </div>
}