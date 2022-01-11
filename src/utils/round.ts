// round a value to a specified number of decimal places
const round = (value: number, decimals = 0) => {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
};

export default round;
