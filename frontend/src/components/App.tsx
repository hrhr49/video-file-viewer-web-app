import * as React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { CustomAppBar } from './CustomAppBar';
import { CustomPagination } from './CustomPagination';
import { CustomBreadcrums } from './CustomBreadcrums';
import { ItemCard } from './ItemCard';

import {axios, BASE_URL} from '../axios';
import {VideoItem, isVideoItem} from '../../../common/types';

const useStyles = makeStyles((theme: any) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));


const App: React.FC<{}> = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const history = useHistory();
  const [videoItemList, setVideoItemList] = React.useState<VideoItem[]>([]);

  const pathnameList = pathname
    .replace(/^\/+/, '')
    .split('/')
    .filter((path: string) => path !== '');

  React.useEffect(() => {
    (async () => {
      const data: unknown = (await axios.get(pathname)).data;
      if (data instanceof Array && data.every(v => isVideoItem(v))) {
        setVideoItemList(data);
      } else {
        throw `data is not VideoItem List type: ${data}`;
      }
    })();
  }, [pathname]);

  return (
    <React.Fragment>
      <CssBaseline />
      <CustomAppBar />
      <main>
        {/* ルートに戻れるように、ダミーで '~' という階層を用意する */}
        <CustomBreadcrums
          texts={['~', ...pathnameList]}
          onChange={(texts: string[]) => {
            const pathToGo = '/' + texts.slice(1).join('/');
            history.push(pathToGo);
          }}
        />
        <Container className={classes.cardGrid} >
          {/* End hero unit */}
          <Grid container spacing={4}>
            {videoItemList.map(({type, thumbnailURL, url}: VideoItem) => (
              <Grid item key={url} xs={12} sm={6} md={3}>
                <ItemCard 
                  onClick={
                    () => {
                      switch (type) {
                        case 'directory': {
                          console.log(url);
                          const pathToGo = url.replace(/\/+/g, '/');
                          history.push(pathToGo);
                          break;
                        }
                        case 'video': {
                          window.open(BASE_URL + '/' + url);
                          break;
                        }
                        default: {
                          const _: never = type;
                          console.error(`${_} is invalid video type`);
                        }
                      }
                    }
                  }
                  imageURL={
                    thumbnailURL ? BASE_URL + '/' + thumbnailURL : "https://source.unsplash.com/random"
                  }
                  imageTitle="Image title"
                  itemName={url.split('/').slice(-1)[0]}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
        <CustomPagination
          count={1}
          onChange={()=>{}}
        />
      </main>
    </React.Fragment>
  );
}

export {
  App
};
