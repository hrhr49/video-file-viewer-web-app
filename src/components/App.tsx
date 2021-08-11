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

import {fetchFileList, BASE_URL, FileLists} from '../fetch';

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
  const [fileLists, setFileLists] = React.useState<FileLists>({dirList: [], mp4List: []});

  const pathnameList = pathname
    .replace(/^\/+/, '')
    .split('/')
    .filter((path: string) => path !== '');

  React.useEffect(() => {
    (async () => {
      setFileLists(await fetchFileList(pathname));
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
            {fileLists.dirList.map((dirPath: string) => (
              <Grid item key={dirPath} xs={12} sm={6} md={3}>
                <ItemCard 
                  onClick={
                    () => {
                      console.log(dirPath);
                      const pathToGo = dirPath.replace(/\/+/g, '/');
                      history.push(pathToGo);

                    }
                  }
                  imageURL=""
                  imageTitle="Image title"
                  itemName={dirPath.split('/').slice(-1)[0]}
                />
              </Grid>
            ))}
            {fileLists.mp4List.map((mp4Path: string) => (
              <Grid item key={mp4Path} xs={12} sm={6} md={3}>
                <ItemCard 
                  onClick={
                    () => {
                      console.log(mp4Path);
                      window.open(BASE_URL + '/' + mp4Path);
                    }
                  }
                  imageURL={BASE_URL + '/' + mp4Path + '.png'}
                  imageTitle="Image title"
                  itemName={mp4Path.split('/').slice(-1)[0]}
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
