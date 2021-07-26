const appendZeroIfOneDigit = (v) => {
    if (v.length === 1) {
        return "0" + v;
    }
    return v;
};

const getTodayDate = () => {
    const todayDate = new Date();

    return todayDate.getFullYear() + "-" +
        appendZeroIfOneDigit((todayDate.getMonth()+1).toString()) + "-" +
        appendZeroIfOneDigit(todayDate.getDate().toString());
}

export default getTodayDate;