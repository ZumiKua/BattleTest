import React from "react";
interface Props{
    saves: string[];
    onClosed: () => void;
    onLoad: (name: string) => void;
}

export function LoadView(props: Props) {
    return <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">
                    读取存档
                </p>
                <button className="delete" aria-label="close" onClick={props.onClosed}></button>
            </header>
            <section className="modal-card-body">
                <div className="content">
                    <ol>
                        {
                            props.saves.map((name, id) => 
                                <li className="load-names" key={id} onClick={() => props.onLoad(name)}>{name}</li>
                            )
                        }
                    </ol>
                </div>
            </section>
        </div>
    </div>
}