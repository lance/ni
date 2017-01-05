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
          for (let i = 0; i < a.labels.length; i++) {
            if (a.labels[i].name === 'good first contribution') {
              console.log(`#${a.number} - ${a.title}`);
              break;
            }
          }
        });
      }
    });
  }
} else {
  console.log('Usage: node index 2 - This will query for page 1 and 2 of the issues.');
  console.log('To get all issues look the github last page and type: node index 27');
  console.log('WARNING:');
  console.log('The number of pages on web UI is diff from API');
  console.log('To get more issues by the fixed label use number of the last page');
  console.log('bigger than current last page on web UI');
}
