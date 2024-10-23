import React from 'react';

const GetData = () => {
    let data = [
        {
        "date": "2024-10-14",
        "time": 0,
        "accuracy": {},
        "e_time": {}
        },
        {
        "date": "2024-10-15",
        "time": 50,
        "accuracy": {
            "plank_accuracy": 97,
            "bicep curls_accuracy": 98
        },
        "e_time": {
            "plank_time": 30,
            "bicep curls_time": 15
        }
        },
        {
        "date": "2024-10-16",
        "time": 0,
        "accuracy": {},
        "e_time": {}
        },
        {
        "date": "2024-10-17",
        "time": 0,
        "accuracy": {},
        "e_time": {}
        },
        {
        "date": "2024-10-18",
        "time": 0,
        "accuracy": {},
        "e_time": {}
        },
        {
        "date": "2024-10-19",
        "time": 0,
        "accuracy": {},
        "e_time": {}
        },
        {
        "date": "2024-10-20",
        "time": 0,
        "accuracy": {},
        "e_time": {}
        },
        {
        "date": "2024-10-21",
        "time": 0,
        "accuracy": {},
        "e_time": {}
        },
        {
        "date": "2024-10-22",
        "time": 0,
        "accuracy": {},
        "e_time": {}
        },
        {
        "date": "2024-10-23",
        "time": 45,
        "accuracy": {
            "bicep curls_accuracy": 97.375
        },
        "e_time": {
            "bicep curls_time": 45
        }
        }
    ]


    const selectedTimePeriod = 'week';

    const lastWeekData = data.slice(-7).map((entry, index) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date(entry.date);
        const dayLabel = daysOfWeek[date.getDay()];
        return {
            value: entry.time,
            label: dayLabel
        };
    });

    const last30DaysPlankData = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy.plank_accuracy || 0
    }));

    const last30DaysBicepCurlsData = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['bicep curls_accuracy'] || 0
    }));

    console.log(last30DaysPlankData);
    console.log(last30DaysBicepCurlsData);
};

export default GetData;