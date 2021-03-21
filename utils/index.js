const asyncForEach = (array, handler) => {
    return new Promise((resolve, reject) => {
        if (!array.length) resolve();
        array.forEach(async (item, index) => {
            try {
                await handler(item);
                if (index === array.length - 1) resolve();
            } catch (err) {
                reject(err);
            }
        });
    });
}

module.exports = { asyncForEach }