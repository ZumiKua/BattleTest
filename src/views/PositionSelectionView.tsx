import React from "react";
type Pos = 0|1|2|3|4|5;

interface Props {
    onPositionChange: (int: Pos) => void;
    currentPosition: Pos;
    isLeft: boolean;
}
export function PositionSelectionView(props: Props) {
    const col = props.isLeft ? [0, 1] : [1, 0];

    return <table className="position-selector">
        <tbody>
            {
                [0,1,2].map(x => <tr key={x}>
                    {
                        (x === 0 && !props.isLeft) ? <td className="frontline" rowSpan={3}>前线</td> : null
                    }
                    {
                        col.map(y => <td key={y} className={x * 2 + y === props.currentPosition ? "selected" : ""} onClick={() => props.onPositionChange((x * 2 + y) as Pos) }></td>)
                    }
                    {
                        (x === 0 && props.isLeft) ? <td className="frontline" rowSpan={3}>前线</td> : null
                    }
                </tr>)
            }
        </tbody>
    </table>
}