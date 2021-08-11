import { config } from 'dotenv';
import { exec } from 'child_process';

// dotenvの読み込み
config();

const FRONTEND_PORT = process.env.FRONTEND_PORT;

if (!FRONTEND_PORT) {
  throw 'env value FRONTEND_PORT is not found. please put it to .env file';
}

const ROOT_DIR = 'dist';
console.log(`move to ${ROOT_DIR}`);
process.chdir(ROOT_DIR);

console.log(`start server at port ${FRONTEND_PORT}`);

exec(`npx http-server --port ${FRONTEND_PORT}`, (err, stdout, stderr) => {
  if (err) {
    console.log(stderr);
    return;
  } else {
    console.log(stdout);
  }
});
