stackGenerator = (count = 21, valuesCount = 3, yearStart = 2000, min = 50, max = 200) => JSON.stringify([...Array(count).keys()]
.map(v => {
    const tmp = {year: v+yearStart};
    for(let i = 0; i < valuesCount; i++){
        tmp[`value${i}`] = min + ~~(Math.random() * (max - min));
    }
    return tmp;
}));

stackGenerator();


let tmp = [];

for(let r = 2015; r < 2021; r++){
    for(let m = 0; m < 12; m++){
        tmp.push({
            date: new Date(r, m).getTime(),
            value: (r-2000)*10 + ~~(Math.random()*100)
        });
    }
}

JSON.stringify(tmp);