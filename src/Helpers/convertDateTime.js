
const covertDateTime = (hours) => {
    Date.prototype.addHours  = (hours) => {
        setTime(getTime() + parseInt(hours*60*60*1000));
        return Date;
    };
}
