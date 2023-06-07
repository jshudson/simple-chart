const transform1D = (value, sourceA, sourceB, targetA, targetB) => {
    return (point - sourceA) * (targetB - targetA) / (sourceB - sourceA) + targetA
}
