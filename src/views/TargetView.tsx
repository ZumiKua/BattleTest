import { Battler } from "../models/Battler";
import React from "react";

interface Props{
    battlers: Battler[];
    areas: [number, number][];
    onTargetSelected: (n: [number, number]) => void;
}

function BattlerRow(props: {onHover: (b: boolean, p: [number, number]) => void, onClick: (p: [number, number]) => void, x: number, battlers: Battler[], highlighted: boolean[]}) {
    return <tr>
        <BattlerCell onHover={props.onHover} onClick={props.onClick} x={props.x} y={0} battlers={props.battlers} highlighted={props.highlighted} />
        <BattlerCell onHover={props.onHover} onClick={props.onClick} x={props.x} y={1} battlers={props.battlers} highlighted={props.highlighted} />
    </tr>
    

}

function BattlerCell(props: {onHover: (b: boolean, p: [number, number]) => void, onClick: (p: [number, number]) => void, x: number, y: number, battlers: Battler[], highlighted: boolean[]}) {
    let pos = props.x * 2 + props.y;
    return <td onMouseLeave={() => props.onHover(false, [props.x,props.y])} onMouseEnter={() => props.onHover(true, [props.x,props.y])} className={`${props.highlighted[pos] ? "highlighted" : ""} target-cell`} onClick={(e) => props.onClick([props.x, props.y])}>{props.battlers[pos] == null ? "" : props.battlers[pos].name}</td>
}



export class TargetView extends React.Component<Props, {hoveredPosition: [number, number] | undefined}> {
    constructor(props: Props) {
        super(props);
        this.state = {hoveredPosition: undefined};
        this.onTargetSelected = this.onTargetSelected.bind(this);
        this.onHover = this.onHover.bind(this);
    }

    onTargetSelected(pos: [number, number]) {
        this.props.onTargetSelected(pos);
    }

    onHover(hovered: boolean, pos: [number, number])  {
        if(hovered) {
            this.setState({hoveredPosition: pos});
        }
        else {
            this.setState((state) => {
                if(state.hoveredPosition !== undefined && state.hoveredPosition[0] === pos[0] && state.hoveredPosition[1] === pos[1]) {
                    return {hoveredPosition: undefined};
                }
                else{
                    return {hoveredPosition: state.hoveredPosition};
                }
            })
        }
    }

    render() {
        let highlighted : number[] = [];
        if(this.state.hoveredPosition !== undefined) {
            let bx = this.state.hoveredPosition[0];
            let by = this.state.hoveredPosition[1];
            this.props.areas.forEach((pos) => {
                let x = bx + pos[0];
                let y = by + pos[1];
                if(x >= 0 && x <= 2 && y >= 0 && y <= 1) {
                    highlighted.push(x * 2 + y);
                }
            })
        }
        let map = Array(6).fill(false);
        highlighted.forEach(v => map[v] = true);
        let battlerMap = Array(6).fill(null);
        this.props.battlers.forEach(b => battlerMap[b.position] = b);
        return <table className="target-table">{
            [0,1,2].map(v => <BattlerRow onHover={this.onHover} onClick={this.onTargetSelected} x={v} battlers={battlerMap} highlighted={map}/>)
        }</table>
    }
}