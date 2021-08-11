import { config } from 'dotenv';

import { exec } from 'child_process';

// dotenvの読み込み
config();

const SERVE_DIR = process.env.SERVE_DIR;
const FILE_SERVER_PORT = process.env.FILE_SERVER_PORT;

if (!SERVE_DIR) {
  throw 'env value SERVE_DIR is not found. please put it to .env file';
}
if (!FILE_SERVER_PORT) {
  throw 'env value FILE_SERVER_PORT is not found. please put it to .env file';
}

console.log(`move to ${SERVE_DIR}`);
process.chdir(SERVE_DIR);

console.log(`start server at port ${FILE_SERVER_PORT}`);

exec(`npx http-server --cors --port ${FILE_SERVER_PORT}`, (err, stdout, stderr) => {
  if (err) {
    console.log(stderr);
    return;
  } else {
    console.log(stdout);
  }
});
