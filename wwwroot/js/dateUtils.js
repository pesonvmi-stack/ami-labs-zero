function parsePeriod(input) {
    const [month, year] = input.split(" ");
    return {
        month: parseInt(month),
        year: parseInt(year)
    };
}

function getStartDate(month, year) {
    return `${year}-${String(month).padStart(2, '0')}-01`;
}

function getEndDate(month, year) {
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
}