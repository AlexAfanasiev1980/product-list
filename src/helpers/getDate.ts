export const getDate = () => {
    const currentDate = new Date();
    const formatDay = `${currentDate.getFullYear()}${currentDate.getMonth() < 9 ? '0' : ''}${currentDate.getMonth() + 1}${currentDate.getUTCDate() < 9 ? '0' : ''}${currentDate.getUTCDate()}`

    return formatDay;
}