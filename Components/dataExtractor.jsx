import React from 'react';

const GetData = (data) => {

    // Ensure `data` is an array
    if (!Array.isArray(data)) {
        console.log("Invalid data format: Expected an array");
        return {};
    }

    // Functions to get the last week, month, and year statistics
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

    // Get the total time spent on each workout for the last week
    const lastMonthData = data.slice(-30).map((entry, index) => {
        const date = new Date(entry.date);
        const dayLabel = date.getDate();
        const totalTime = Object.values(entry.e_time).reduce((acc, time) => acc + time, 0);
        return {
            value: totalTime,
            label: dayLabel
        };
    });

    // Get the total time spent on each workout for the last week
    const lastYearMonthlyAverageData = data.slice(-365).reduce((acc, entry) => {
        const date = new Date(entry.date);
        const month = date.getMonth();
        const year = date.getFullYear();
        const totalTime = Object.values(entry.e_time).reduce((acc, time) => acc + time, 0);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Create a unique label for each month-year
        const label = `${months[month]} ${year}`;
        
        // Find or create the month-year entry
        const monthData = acc.find(item => item.label === label);
        if (monthData) {
            monthData.value += totalTime;
        } else {
            acc.push({ label, value: totalTime, year, month });
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
        accuracy: entry.accuracy['lat pull down_accuracy'] || 0,
        e_time: entry.e_time['lat pull down_time'] || 0,
        e_reps: entry.e_reps['lat pull down_reps'] || 0
    }))[0];

    const todayBicepCurlData = data.slice(-1).map(entry => ({
        accuracy: entry.accuracy['bicep curls_accuracy'] || 0,
        e_time: entry.e_time['bicep curls_time'] || 0,
        e_reps: entry.e_reps['bicep curls_reps'] || 0
    }))[0];

    // last month individual workout accuracy
    const lastMonthPlankAccuracy = data.slice(-30).map(entry => ({
        label: entry.date,
        value: entry.accuracy.plank_accuracy || 0
    }));

    const lastMonthBicepCurlsAccuracy = data.slice(-30).map(entry => ({
        label: entry.date,
        value: entry.accuracy['bicep curls_accuracy'] || 0
    }));

    const lastMonthSquatAccuracy = data.slice(-30).map(entry => ({
        label: entry.date,
        value: entry.accuracy['squat_accuracy'] || 0
    }));

    const lastMonthLatPullDownAccuracy = data.slice(-30).map(entry => ({
        label: entry.date,
        value: entry.accuracy['lat pull down_accuracy'] || 0
    }));

    const lastMonthPushUpAccuracy = data.slice(-30).map(entry => ({
        label: entry.date,
        value: entry.accuracy['push up_accuracy'] || 0
    }));

    //console.log(lastYearMonthlyAverageData);

    return {
        lastWeekData,
        lastMonthData,
        lastYearMonthlyAverageData,
        todayPlankData,
        todayPushUpData,
        todaySquatData,
        todayLatPullDownData,
        todayBicepCurlData,
        lastMonthPlankAccuracy,
        lastMonthBicepCurlsAccuracy,
        lastMonthSquatAccuracy,
        lastMonthLatPullDownAccuracy,
        lastMonthPushUpAccuracy
    };

};


export default GetData;