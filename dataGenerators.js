stackGenerator = (count = 21, valuesCount = 3, yearStart = 2000, min = 50, max = 200) => JSON.stringify([...Array(count).keys()]
.map(v => {
    const tmp = {year: v+yearStart};
    for(let i = 0; i < valuesCount; i++){
        tmp[`value${i}`] = min + ~~(Math.random() * (max - min));
    }
    return tmp;
}));

stackGenerator();