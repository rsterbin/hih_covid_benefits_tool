// Anything not worth installing a library for

// shuffle (durstenfeld/fisher-yates)
export const shuffle = given => {
    // work backwards to the beginning of the array
    let result = given.slice(0);
    let current = result.length;
    while (0 !== current) {
        // first, step back from the last element we worked on
        current -= 1;
        // pick one of the remaining elements at random
        const random = Math.floor(Math.random() * current);
        // and swap it with the current element
        const tmp = result[current];
        result[current] = result[random];
        result[random] = tmp;
    }
    return result;
};

