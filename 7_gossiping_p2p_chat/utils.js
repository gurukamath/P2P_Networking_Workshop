const _ = require("lodash");

const upsert = function (arr, key, newval) {
    const ind = _.findIndex(arr, key);
    if(ind !== -1){
        arr.splice(ind, 1, newval);
    } else {
        arr.push(newval);
    }
};

module.exports = {upsert};

