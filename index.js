'use strict';

const spawn = require('child_process').spawn;

if (process.argv.length === 3) {
  let pages = process.argv[2];
  const issuesBaseUrl = 'https://api.github.com/repos/nodejs/node/issues?status=open&page=';
  for (let i = 1; i <= pages; i++) {
    let result = '';
    let issuesUrl = issuesBaseUrl + i;
    const curl = spawn('curl', [issuesUrl]);
    curl.stdout.on('data', d => {
      result += d;
    });
    curl.on('close', code => {
      let o = JSON.parse(result);
      if (o.length) {
        let arr = Object.keys(o).map(k => o[k]);
        arr.forEach(a => {
          console.log(`#${a.number} - ${a.title}`);
        });
      }
    });
  }
} else {
  console.log('Usage: node index 2 - This will query for page 1 and 2 of the issues.');
  console.log('To get all issues look the github last page and type: node index 27');
}
