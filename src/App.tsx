import React from 'react';
import './App.css';
import { Side, SideData } from './models/Side';
import { Attribute } from './models/Attribute';
import { SideView } from './views/SideView';

const App: React.FC = () => {
    const sideAData : SideData = {hp: 100, sp: 10, battlers: [
        {dp: 3, attributeResistances: {[Attribute.Fire]: 2, [Attribute.Earth]: 0, [Attribute.Electric]: 5, [Attribute.Wind]: 0, [Attribute.Water]: 0}, name: "Actor", position: 0}
    ]};
    const sideBData : SideData = {hp: 50, sp: 4, battlers: [
        {dp: 4, attributeResistances: {[Attribute.Fire]: 0, [Attribute.Earth]: 4, [Attribute.Electric]: 0, [Attribute.Wind]: 0, [Attribute.Water]: 0}, name: "Enemy", position: 0}
    ]};
    const sideA = new Side(sideAData);
    const sideB = new Side(sideBData);
    return (
        <div className="platform">
            <SideView side={sideA} /> <p className="vs">VS</p> <SideView side={sideB} /> 
        </div>
        
    );
}

export default App;
