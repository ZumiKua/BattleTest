import React from "react";
interface Props{
    label: string;
    [x:string] :any;
}
export function Field(props: Props) {
    let {label, ...inputProps} = props;
    let className = "input";
    if(inputProps["type"] === "checkbox") {
        className = "checkbox";
    }
    return <div className="field is-horizontal">
        <div className="field-label">
            <label className="label">{label}</label>
        </div>
        <div className="field-body">
            <div className="field">
                <div className="control">
                    <input className={className} {...inputProps}/>
                </div>
                
            </div>
        </div>
        
    </div>
}