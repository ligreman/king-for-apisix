function sortArrayOfObjects(arrObjs) {
    arrObjs.sort(function (a, b) {
        if (a.value.name < b.value.name) {
            return -1;
        }
        if (a.value.name > b.value.name) {
            return 1;
        }
        return 0;
    });
    return arrObjs;
}

module.exports = {sortArrayOfObjects};
