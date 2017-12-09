var ps = require('./index');


console.log('>> test')
ps.spawn('node', ['-v'], {cwd: 'C:/'}).then(a => console.log('rep>> ', a)).catch(e => console.error('got error>> ', e));
// ps.exec('dir').then(a=> console.log(a)).catch(e => console.error('got error>> ', e));
console.log('---- end')