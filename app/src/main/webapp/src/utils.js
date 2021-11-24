// How in God's name does javascript not have this already...
export function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

// How in God's name does javascript not have this already...
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function histogram(data) {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const step = (max - min) / 20
    
    const bucket = el => Math.round((el - min) / step)
    const groups = groupBy(data, bucket)
    const ret = []
    for (let i = 0; i < bucket(max); i++){        
        ret[i] = {
            start: i * step + min,
            end: (i+1) * step + min,
            count: groups.get(i)?.length ?? 0
        }
    }
    return ret
}