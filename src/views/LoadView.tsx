import React from "react";
interface Props{
    saves: string[];
    onClosed: () => void;
    onLoad: (name: string) => void;
}

export function LoadView(props: Props) {
    return <div className="modal-container show">
        <div className="modal load-dialog">
            <p className="modal-header">
                <span className="modal-title">读取存档</span>
                <span><button className="anchor-like-button" onClick={() => props.onClosed()}>[X]</button></span>
            </p>
            {
                props.saves.map((name, id) => 
                    <p className="load-names" key={id} onClick={() => props.onLoad(name)}>{name}</p>
                )
            }
        </div>
        
    </div>
}