import React from 'react';

const GetData = () => {
    let data = [
        {
            "date": "2024-08-14",
            "time": 0,
            "accuracy": {},
            "e_time": {},
            "e_reps": {}
            },
            {
            "date": "2024-06-15",
            "time": 50,
            "accuracy": {
                "plank_accuracy": 97,
                "bicep curls_accuracy": 98
            },
            "e_time": {
                "plank_time": 30,
                "bicep curls_time": 15
            },
            "e_reps": {
                "plank_reps": 10,
                "bicep curls_reps": 10
            }
        },
        {
        "date": "2024-10-14",
        "time": 0,
        "accuracy": {},
        "e_time": {},
        "e_reps": {}
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
        },
        "e_reps": {
            "plank_reps": 10,
            "bicep curls_reps": 10
        }
        },
        {
        "date": "2024-10-16",
        "time": 0,
        "accuracy": {},
        "e_time": {},
        "e_reps": {}
        },
        {
        "date": "2024-10-17",
        "time": 0,
        "accuracy": {},
        "e_time": {},
        "e_reps": {}
        },
        {
        "date": "2024-10-18",
        "time": 0,
        "accuracy": {},
        "e_time": {},
        "e_reps": {}
        },
        {
        "date": "2024-10-19",
        "time": 0,
        "accuracy": {},
        "e_time": {},
        "e_reps": {}
        },
        {
        "date": "2024-10-20",
        "time": 0,
        "accuracy": {},
        "e_time": {},
        "e_reps": {}
        },
        {
        "date": "2024-10-21",
        "time": 0,
        "accuracy": {},
        "e_time": {},
        "e_reps": {}
        },
        {
        "date": "2024-10-22",
        "time": 0,
        "accuracy": {},
        "e_time": {},
        "e_reps": {}
        },
        {
        "date": "2024-10-23",
        "time": 45,
        "accuracy": {
            "bicep curls_accuracy": 97.375
        },
        "e_time": {
            "bicep curls_time": 45,
            "plank_time": 100
        },
        "e_reps": {
            "bicep curls_reps": 20
        }
        }
    ]



    const lastWeekData = data.slice(-7).map((entry, index) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date(entry.date);
        const dayLabel = daysOfWeek[date.getDay()];
        const totalTime = Object.values(entry.e_time).reduce((acc, time) => acc + time, 0);
        
        return {
            value: totalTime,
            label: dayLabel
        };
    });

    const lastMonthData = data.slice(-30).map((entry, index) => {
        const date = new Date(entry.date);
        const dayLabel = date.getDate();
        const totalTime = Object.values(entry.e_time).reduce((acc, time) => acc + time, 0);
        return {
            value: totalTime,
            label: dayLabel
        };
    });

    const lastYearMonthlyAverageData = data.slice(-365).reduce((acc, entry) => {
        const date = new Date(entry.date);
        const month = date.getMonth();
        const totalTime = Object.values(entry.e_time).reduce((acc, time) => acc + time, 0);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
        // Find or create the month entry
        const monthData = acc.find(item => item.month === months[month]);
        if (monthData) {
            monthData.total += totalTime;
        } else {
            acc.push({month: months[month], total: totalTime });
        }
        return acc;
    }, []);
    

    

    // Functions to get today's workout statistics

    const todayPlankData = data.slice(-1).map(entry => ({
        accuracy: entry.accuracy['plank_accuracy'] || 0,
        e_time: entry.e_time['plank_time'] || 0
    }))[0];

    const todayPushUpData = data.slice(-1).map(entry => ({
        accuracy: entry.accuracy['pushup_accuracy'] || 0,
        e_time: entry.e_time['pushup_time'] || 0,
        e_reps: entry.e_reps['pushup_reps'] || 0
    }))[0];

    const todaySquatData = data.slice(-1).map(entry => ({
        accuracy: entry.accuracy['squat_accuracy'] || 0,
        e_time: entry.e_time['squat_time'] || 0,
        e_reps: entry.e_reps['squat_reps'] || 0
    }))[0];

    const todayLatPullDownData = data.slice(-1).map(entry => ({
        accuracy: entry.accuracy['plank_accuracy'] || 0,
        e_time: entry.e_time['plank_time'] || 0,
        e_reps: entry.e_reps['plank_reps'] || 0
    }))[0];

    const todayBiceCurlData = data.slice(-1).map(entry => ({
        accuracy: entry.accuracy['bicep curls_accuracy'] || 0,
        e_time: entry.e_time['bicep curls_time'] || 0,
        e_reps: entry.e_reps['bicep curls_reps'] || 0
    }))[0];

    //Last week each day total worked out time
    const lastWeekEachDayTotalTime = data.slice(-7).map(entry => ({
        date: entry.date,
        time: entry.time
    }));


    // Functions to get last 30 days workout statistics
    const last30DaysPlankData = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy.plank_accuracy || 0
    }));

    const last30DaysBicepCurlsData = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['bicep curls_accuracy'] || 0
    }));

    const last30DaysSquatData = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['squat_accuracy'] || 0
    }));

    const last30DaysLatPullDownData = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['lat pull down_accuracy'] || 0
    }));

    const last30DaysPushUpData = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['push up_accuracy'] || 0
    }));

    // last month individual workout accuracy

    const lastMonthPlankAccuracy = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy.plank_accuracy || 0
    }));

    const lastMonthBicepCurlsAccuracy = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['bicep curls_accuracy'] || 0
    }));

    const lastMonthSquatAccuracy = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['squat_accuracy'] || 0
    }));

    const lastMonthLatPullDownAccuracy = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['lat pull down_accuracy'] || 0
    }));

    const lastMonthPushUpAccuracy = data.slice(-30).map(entry => ({
        date: entry.date,
        accuracy: entry.accuracy['push up_accuracy'] || 0
    }));

    console.log(lastMonthBicepCurlsAccuracy);

};

export default GetData;