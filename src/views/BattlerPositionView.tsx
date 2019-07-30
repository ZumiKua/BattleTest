import { Position, XYPosToFlat, BattlerData } from "../models/Battler";
import React, { ChangeEvent } from "react";

interface Props{
    battlers: BattlerData[];
    battlerPositions: {[p in Position]?: number | undefined};
    onBattlerPositionChanged: (pos: Position, id: number | undefined) => void;
    isLeft: boolean;
}
export function BattlerPositionView(props: Props) {
    const ys = props.isLeft ? [0, 1] : [1, 0];
    const changeHandler = (pos: Position, e: ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value === "unselect" ? undefined : parseInt(e.target.value);
        props.onBattlerPositionChanged(pos, id);
    }
    return <div>
        <table className="battler-position-view">
            <tbody>{
                [0,1,2].map(x => <tr key={x}>
                    {
                        (x === 0 && !props.isLeft) ? <td rowSpan={3} className="frontline">前线</td> : null
                    }
                    {
                        ys.map(y => {
                            const pos = XYPosToFlat(x as 0|1|2, y as 0|1);
                            const id = props.battlerPositions[pos];
                            const selected = id === undefined ? "unselect" : id.toString();
                            return <td key={y} align="center">
                                <div className="select">
                                    <select value={selected} onChange={e => changeHandler(pos, e)}>
                                        <option value="unselect"></option> 
                                        {
                                            props.battlers.map(b => <option key={b.id} value={b.id.toString()}>
                                                {b.name}
                                            </option>)
                                        }
                                    </select>
                                </div>
                            </td>
                        })
                    }
                    {
                        (x === 0 && props.isLeft) ? <td rowSpan={3} className="frontline">前线</td> : null
                    }
                </tr>)
            }</tbody>
        </table>
    </div>
}