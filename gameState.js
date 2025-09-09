import { updateIndicatorTransforms } from "./indicators.js";


export const targetLocations = [0, 0, 2, 6];
export const tileStates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let defenderCount = 3;
let defenderPtr = 2;

export function setTarget(id) {
    if (tileStates[id] != 0) {
        return;
    }
    if (id < 9) {
        if (targetLocations[1] == id || targetLocations[2] == id || targetLocations[3] == id) {
            return;
        }
        targetLocations[defenderPtr] = id;
        updateIndicatorTransforms(defenderPtr, id);
        defenderPtr = defenderPtr == defenderCount ? 1 : defenderPtr + 1;
    } else {
        targetLocations[0] = id - 9;
        updateIndicatorTransforms(0, id - 9);
    }
}