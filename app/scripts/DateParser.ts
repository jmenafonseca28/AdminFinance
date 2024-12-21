//Format: yyyy-MM-DD
function parseDate(date: string): Date {
    const dateParts = date.split('-');
    return new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
}

export {parseDate};