import React from "react";
import CircularProgress from "react-native-circular-progress-indicator";

function PieChartCard({value,title}) {
    return (
        <CircularProgress
            value={value}
            valueSuffix="%"
            radius={60}
            duration={500}
            progressValueColor={'white'}
            maxValue={100}
            title={title}
            titleColor={'#E2F163'}
            activeStrokeColor={'#E2F163'}
        />
    );
};

export default PieChartCard;