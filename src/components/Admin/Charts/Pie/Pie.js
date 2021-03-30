import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const pieChart = (props) => {

    let height = 250;
    let margin = 30;

    height += (props.data.length * 17);
    margin += (props.data.length * 17);
    console.log('height', height);
    console.log('margin', margin);

    return (
        <div style={{ height: height + 'px' }}>
            <ResponsivePie data={props.data}
                margin={{ top: 20, right: 40, bottom: margin, left: 40 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'paired' }}
                borderWidth={0.5}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                enableRadialLabels={false}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'column',
                        translateX: margin * -1,
                        translateY: margin,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        symbolShape: 'circle',
                    }
                ]}
                />
        </div>
    );
};

export default pieChart;
