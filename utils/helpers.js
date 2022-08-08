module.exports = {
    format_date: date => {
        const month = new Date(date).getMonth() + 1;
        const day = new Date(date).getDate()
        const year = new Date(date).getFullYear();

        return `${month}/${day}/${year}`;
    },
    format_plural: (noun, amount) => {
        if (amount === 1) {
            return noun;
        } else {
            return noun + 's'
        }
    },
    format_url: url => {
        // remove everything but the base url
        return url.replace('http://', '')
        .replace('https://', '')
        .replace('www.', '')
        .split('/')[0]
        .split('?')[0];
    }
};