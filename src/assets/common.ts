function onWheel(event: WheelEvent) {
    const rcSchema: HTMLElement = <HTMLElement>event.currentTarget;
    rcSchema.scrollBy({
        top: event.deltaY,
    })
}

function min(args: number[]): number
function min (...args: number[]): number
function min (firstArg: number[] | number, ...args: number[]): number {
    if (args.length < 1) {
        throw new Error('no value with use min!');
    }
    let _min = firstArg;
    if (_min instanceof Array) {
        return min(..._min);
    } else {
        for (const num of args) {
            _min = _min < num ? _min : num;
        }
        return _min;
    }
}

function max (args: number[]): number
function max (...args: number[]): number
function max (firstArg: number[] | number, ...args: number[]): number {
    if (args.length < 1) {
        throw new Error('no value with use min!');
    }
    let _max = firstArg;
    if (_max instanceof Array) {
        return max(..._max);
    } else {
        for (const num of args) {
            _max = _max > num ? _max : num;
        }
        return _max;
    }
}

function sum (args: number[]): number
function sum (...args: number[]): number
function sum (firstArg: number[] | number, ...args: number[]): number {
    if (args.length < 1) {
        throw new Error('no value with use min!');
    }
    let _sum = firstArg;
    if (_sum instanceof Array) {
        return min(..._sum);
    } else {
        for (const num of args) {
            _sum += num;
        }
        return _sum;
    }
}

const {abs} = Math;

export {
    onWheel, max, min, sum, abs
};

export default {
    onWheel, max, min, sum, abs
};