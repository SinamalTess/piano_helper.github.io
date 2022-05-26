export function formatToPixelValue(input) {
    const numberValue = Number(input);
    const pixelPattern = /^\d*(px)$/; // checks if the value is any number immediately followed by 'px'
    const percentagePattern = /^\d*%$/; // checks if the value is a percentage

    if (pixelPattern.test(input)) {
        return input
    } else if (percentagePattern) {
        return input?.replace('%', 'px')
    } else if (!Number.isNaN(numberValue)) {
        return numberValue + 'px';
    } else {
        console.error(`Couldn't convert ${input} of type ${typeof input} to pixel value`);
        return '0px';
    }
}