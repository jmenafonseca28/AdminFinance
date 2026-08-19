function formatDateString(dateString: string): string {
    const cleanDate = dateString.split("T")[0]; // elimina la hora si viene en formato UTC
    const [year, month, day] = cleanDate.split("-");
    return `${day}/${month}/${year}`;
}


export {formatDateString};