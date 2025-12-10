//Format: yyyy-MM-DD
function formatDateString(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}


export {formatDateString};