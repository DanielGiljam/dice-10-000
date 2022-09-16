// From https://stackoverflow.com/a/11935263/9235291
export const randomSubset = <T>(superset: T[], size: number) => {
    const shuffled = [...superset];
    let i = superset.length;
    let temp;
    let index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
};
