"use strict";
function convertTimestampToSeconds(timestamp) {
    // "9 hours ago"
    const splitTimestamp = timestamp
        .split(" ", 2);
    if (!splitTimestamp)
        return;
    const timeMapToSeconds = [
        { name: "second", value: 1 },
        { name: "minute", value: 60 },
        { name: "hour", value: 3600 },
        { name: "day", value: 86400 },
        { name: "week", value: 604800 },
        { name: "month", value: 2628000 },
        { name: "year", value: 31540000 }
    ];
    const timed = {
        num: parseInt(splitTimestamp[0], 10),
        name: splitTimestamp[1],
    };
    for (const time of timeMapToSeconds) {
        if (timed.name.includes(time.name)) {
            return timed.num * time.value;
        }
    }
}
