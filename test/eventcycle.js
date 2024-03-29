setTimeout(() => {
    console.log(1);
}, 1000);
process.nextTick(() => {
    console.log(3)
});
setTimeout(() => {
    console.log(2);
    process.nextTick(() => {
        console.log(4)
    });
}, 1000);
console.log(5)

process.on('beforeExit', () => {
    console.log('Event loop is about to start');
});