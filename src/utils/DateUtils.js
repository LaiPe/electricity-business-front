export const formatDate = (date) => {
    if (typeof date === 'string') return date;
    // Si c'est un objet Date, formater en ISO local (sans conversion UTC)
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};