
export const statsToChartData = (stats) => {
    if (typeof stats != 'object') {
        stats = {};
    }
    const cdata = [];
    for (const key in stats) {
        cdata.push({
            id: key,
            label: key,
            value: stats[key],
        });
    }
    if (cdata.length < 1) {
        cdata.push({
            id: 'NO DATA',
            label: 'NO DATA',
            value: 1
        });
    }
    return cdata;
};

