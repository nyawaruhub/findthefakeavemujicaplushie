function getRandomItem(list) {
    return list[getRandomInt(list.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}