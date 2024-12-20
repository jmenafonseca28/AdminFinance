function verifyFields(...data: string[]) {
    return data.every((field) => field && field !== '');
}

function isLogged() {
    return localStorage.getItem('token') ? true : false;
}

export { verifyFields, isLogged };