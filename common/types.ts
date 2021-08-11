interface VideoItem {
  type: 'directory' | 'video';
  url: string;
  thumbnailURL?: string;
}

const isVideoItem = (obj: any): obj is VideoItem => {
  return typeof obj === 'object'
    && 'type' in obj
    && 'url' in obj
    && ['directory', 'video'].includes(obj.type)
    && typeof obj.url === 'string';
};

export {
  VideoItem,
  isVideoItem
}
