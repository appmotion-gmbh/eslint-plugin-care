module.exports = (className) => (
    className.split('__')[0].split('--')[0]
);
