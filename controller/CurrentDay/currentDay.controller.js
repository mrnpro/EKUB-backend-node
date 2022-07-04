const currentDay = (day) => {
    const daysDeference = new Date().getTime() - new Date(day).getTime();


    return new Date(daysDeference).getDate() - 1;

}
module.exports = { currentDay }