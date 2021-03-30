import React from 'react';
import { ResponsivePie } from '@nivo/pie';

import './Pie.css';

const pieChart = (props) => {

    return (
        <div className="PieChart">
            <div className="Diagram" style={{ height: '250px' }} key="diagram">
                <ResponsivePie data={props.data}
                    margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={{ datum: 'data.color' }}
                    borderWidth={0.5}
                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                    enableRadialLabels={false}
                    />
            </div>
            <div className="Legend" key="legend">
                {props.data.map((item, idx) =>
                    <div className="Item" key={'item-' + idx}>
                        <div key="dot" className="Cell Dot">
                            <span className="InnerDot" style={{ backgroundColor: item.color }}></span>
                        </div>
                        <div key="label" className="Cell Label">{item.label}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default pieChart;
