

const cluster = require('cluster');
const os = require('os');
const cpuNum = os.cpus().length;
const process = require('process');

console.log('cpu nums: ', cpuNum);

const workers = {};

if (cluster.isMaster) {
    cluster.on('death', function (worker) {
        console.log('重新创建新的');
        worker = cluster.fork();
        workers[worker.pid] = worker;
    });

    // fork 工作进程
    for (let i = 0; i < cpuNum; i++) {
        const worker = cluster.fork();
        workers[worker.pid] = worker;
    }
}
else {
    // 工作进程，启动服务器
    const app = require('./app');
    app.use(async (ctx, next) => {
        console.log('worker ' + cluster.worker.id + '  Pid: ' + process.pid);
        next();
    });
    app.listen(3000);
}

process.on('SIGTERM', function () {
    Object.keys(workers).forEach(pid => {
        console.log('kill pid ', pid);
        process.kill(pid);
    });
    process.exit(0);
});
