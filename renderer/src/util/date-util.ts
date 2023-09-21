export function dateFormat(date: Date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    const monthStr  = month  >= 10 ? month  : '0' + month;
    const dayStr    = day    >= 10 ? day    : '0' + day;
    const hourStr   = hour   >= 10 ? hour   : '0' + hour;
    const mintueStr = minute >= 10 ? minute : '0' + minute;
    const secondStr = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + mintueStr + ':' + secondStr;
}