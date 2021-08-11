import * as React from 'react';
import {FC} from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

const NotFoundPage: FC = () => {
  // Routeで設定したパラメータを取得
  const { slug } = useParams<any>();

  return (
    <React.Fragment>
      <Typography gutterBottom variant="h5" component="h2">
        Sorry... URL: { slug } is not found...
      </Typography>
      <SentimentVeryDissatisfiedIcon />
    </React.Fragment>
  );
}

export {
  NotFoundPage,
}
