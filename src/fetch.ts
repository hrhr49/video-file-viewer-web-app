import axiosBase from 'axios';

const FILE_SERVER_PORT = process.env.FILE_SERVER_PORT;

if (!FILE_SERVER_PORT) {
  throw `FILE_SERVER_PORT is not found. set FILE_SERVER_PORT in .env file`;
}

const BASE_URL = `http://${location.hostname}:${FILE_SERVER_PORT}`;
const axios = axiosBase.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'  
});

interface FileLists {
  dirList: string[];
  mp4List: string[];
}

const isFileLists = (obj: any): obj is FileLists => {
  return (
    typeof obj === 'object'
    && obj.dirList instanceof Array
    && obj.mp4List instanceof Array
    && obj.dirList.every((v: any) => typeof v === 'string')
    && obj.mp4List.every((v: any) => typeof v === 'string')
  );
};

const fetchFileList = async (dirPath: string): Promise<FileLists> => {
  const url = ('/' + [dirPath, 'fileList.json'].join('/')).replace(/\/+/g, '/');
  const data: unknown = (await axios.get(url)).data;

  if (isFileLists(data)) {
    return data;
  } else {
    throw `data is not FileLists type: ${data}`;
  }
};

export {
  fetchFileList,
  BASE_URL,
  FileLists,
};
