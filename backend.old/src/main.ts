import http from 'http';
import fs from 'fs';
import path from 'path';

import { promisify } from 'util';

const fsStat = promisify(fs.stat);
const fsExists = promisify(fs.exists);
const fsReaddir = promisify(fs.readdir);

import ffmpeg from 'fluent-ffmpeg';

import {
  HOST,
  PORT,
} from '../../common/config';
import {
  SERVE_DIR,
} from './config';

process.chdir(SERVE_DIR);

interface FileInfo {
  type: 'directory' | 'video';
  url: string;
  thumbnailURL?: string;
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml'
} as const;

http.createServer(async (request, response) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Request-Method': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': 2592000, // 30 days
  };

  request.setEncoding('utf-8');


  console.log('request ', request.url);
  console.log('decoded request ', decodeURI(request.url ?? ''));

  const filePath = '.' + decodeURI(request.url ?? '');
  const extname = String(path.extname(filePath)).toLowerCase();

  if (!(await fsExists(filePath))) {
    const msg = `ERROR: fle: ${filePath} is not exists`;
    console.error(msg);
    response.writeHead(500);
    response.end(msg);
    response.end();
    return;
  }

  if (!fs.statSync(filePath).isDirectory() && !(extname in mimeTypes)) {
    const msg = `ERROR: extension: ${extname} is not supported`;
    console.error(msg);
    response.writeHead(500);
    response.end(msg);
    response.end();
    return;
  }

  const contentType = (mimeTypes as any)[extname] as string || 'application/octet-stream';
  console.log({contentType});

  if ((await fsStat(filePath)).isDirectory()) {
    // if the filePath is directory,
    // return JSON data for list of directory, mp4 files
    const fileInfoList: FileInfo[] = [];
    const childFilePaths = await fsReaddir(filePath);

    for (let childFilePath of childFilePaths) {
      childFilePath = filePath + '/' + childFilePath;

      // console.log(childFilePath);

      if ((await fsStat(childFilePath)).isDirectory()) {
        fileInfoList.push({
          type: 'directory',
          url: encodeURI(childFilePath),
        });
      } else if (path.extname(childFilePath) === '.mp4') {
        const thumbnailFilePath = `${childFilePath}.png`;
        if (!(await fsExists(thumbnailFilePath))) {
          const ffmpegPromise = new Promise<void>((resolve, _reject) => {
            ffmpeg(childFilePath)
              .on('end', () => {
                resolve();
              })
              .screenshots({
                timestamps: ['50%'],
                filename: thumbnailFilePath,
                // folder: '/path/to/output',
                size: '320x240'
              });
          });
          await ffmpegPromise;
        }

        fileInfoList.push({
          type: 'video',
          url: childFilePath,
          thumbnailURL: encodeURI(thumbnailFilePath),
        });
      } else {
        // console.error(`unsupported ext: ${path.extname(childFilePath)}`);
      }
    }

    const content = JSON.stringify(fileInfoList);
    console.log(`fileInfoList: ${fileInfoList}`);
    console.log(`filePath: ${filePath}`);
    console.log(`content: ${content}`);
    response.writeHead(200, {...headers, 'Content-Type': mimeTypes['.json']});
    response.end(content, 'utf-8');
  } else if (extname !== '.mp4') {

    // file except mp4
    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == 'ENOENT') {
          response.writeHead(404);
          response.end(`file not found ${filePath} ${error.code} ..\n`);
          response.end();
        } else {
          response.writeHead(500);
          response.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
          response.end();
        }
      } else {
        response.writeHead(200, {...headers, 'Content-Type': contentType});
        response.end(content, 'utf-8');
      }
    });
  } else {
    // mp4 file

    const stat = await fsStat(filePath);
    const fileSize = stat.size;
    const range = request.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const readStream = fs.createReadStream(filePath);
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };
      response.writeHead(206, {...headers, ...head});
      readStream.pipe(response);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      response.writeHead(200, {...headers, ...head});
      fs.createReadStream(filePath).pipe(response);
    }
  }

}).listen(PORT, HOST);
console.log(`Server running at http://${HOST}:${PORT}/`);
