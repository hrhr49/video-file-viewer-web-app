import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { config } from 'dotenv';
import chokidar from 'chokidar';
import ffmpeg from 'fluent-ffmpeg';

// dotenvの読み込み
config();

const SERVE_DIR = process.env.SERVE_DIR;
const DEBUG = false;

if (!SERVE_DIR) {
  throw 'env value SERVE_DIR is not found. please put .env file';
}


const fsStat = promisify(fs.stat);
const fsExists = promisify(fs.exists);
const fsReaddir = promisify(fs.readdir);
const fsWriteFile = promisify(fs.writeFile);
// const fsReadFile = promisify(fs.readFile);

// ディレクトリのファイル一覧情報や
// 動画のサムネイルを作成するためのプログラム

const watcher = chokidar.watch(SERVE_DIR, {
  ignored: /[\/\\]\..*|.*\.(json|png|jpeg|jpg)/,  // ignore dotfiles, json, png, jpeg, jpg
  persistent: true,
});

const updateResources = async (dirPath: string = SERVE_DIR) => {
  const filePathList = await fsReaddir(dirPath);
  const dirList: string[] = [];
  const mp4List: string[] = [];

  for (let filePath of filePathList) {
    // ドットから始まるファイル名はスキップ
    if (filePath.startsWith('.')) {
      continue;
    }
    filePath = path.join(dirPath, filePath);
    const isDir = (await fsStat(filePath)).isDirectory();
    const isMP4 = path.extname(filePath) === '.mp4';

    if (isDir) {
      dirList.push(filePath);
    } else if (isMP4) {
      mp4List.push(filePath);
    }
  }


  // ディレクトリ内のファイル一覧を作成
  await fsWriteFile(
    `${dirPath}/fileList.json`,
    JSON.stringify({
      // NOTE: SERVE_DIRからの相対パスに修正して書き出す
      dirList: dirList.map((dirPath: string) => path.relative(SERVE_DIR, dirPath)),
      mp4List: mp4List.map((mp4Path: string) => path.relative(SERVE_DIR, mp4Path)),
    }, null, '  ')
  );

  // 動画のサムネイルの作成
  for (const filePath of mp4List) {
    const thumbnailFilePath = `${filePath}.png`;
    if (!(await fsExists(thumbnailFilePath))) {
      // console.log(thumbnailFilePath);
      try {
        const ffmpegPromise = new Promise<void>((resolve, reject) => {
          ffmpeg(filePath)
            .screenshots({
              timestamps: ['50%'],
              // NOTE: filenameをフルパスにしてfolderを省略するとエラーになる。要調査
              filename: path.basename(thumbnailFilePath),
              folder: path.dirname(thumbnailFilePath),
              size: '320x240'
            })
            .on('end', () => {
              resolve();
            })
            .on('error', (err: any) => {
              reject(err);
            });
        });

        // エラー回避のため、一つずつ順番にffmpegを使う
        await ffmpegPromise;
        // console.log('fin', thumbnailFilePath);
      } catch (e) {
        console.error(thumbnailFilePath);
        console.error(e);
      }
    }
  }

  // 再帰的に子ディレクトリにも関数を適用する
  const childDirPromises = dirList.map(updateResources);
  await Promise.all(childDirPromises);
};

const _updateResources = (path: string, eventName: string) => {
  if (DEBUG) {
    console.log(`EVENT: ${eventName} path: ${path}`);
  }
  setTimeout(() => {
    updateResources();
  }, 100);
};

watcher
  .on('ready', () => _updateResources('', 'ready'))
  .on('add', (path: string) => _updateResources(path, 'add'))
  .on('change', (path: string) => _updateResources(path, 'change'))
  .on('addDir', (path: string) => _updateResources(path, 'addDir'))
  .on('unlink', (path: string) => _updateResources(path, 'unlink'))
  .on('unlinkDir', (path: string) => _updateResources(path, 'unlinkDir'))
// .on('error', () => updateResources())

// const fileURL = '.' + (request.url ?? '');
