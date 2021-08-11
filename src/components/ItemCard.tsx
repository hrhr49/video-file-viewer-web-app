import * as React from 'react';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import GetAppIcon from '@material-ui/icons/GetApp';
import FolderIcon from '@material-ui/icons/Folder';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    transition: 'ease-in',
    transitionDuration: '0.15s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardMediaEmpty: {
    paddingTop: '56.25%', // 16:9
    background: theme.palette.grey[300],
  },
  cardContent: {
    flexGrow: 1,
  },
}));

interface IItemCardProps {
  onClick: () => void;
  imageURL: string;
  imageTitle?: string;
  itemName: string;
}

// TODO: Info, Download
const ItemCard: React.FC<IItemCardProps> = ({
  onClick,
  imageURL,
  imageTitle = '',
  itemName,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Link 
        onClick={(event: any) => {
          event.preventDefault();
          onClick();
        }}
      >
        {
          imageURL
          ?
          <CardMedia
            className={classes.cardMedia}
            image={imageURL}
            title={imageTitle}
          />
          :
          <CardMedia
            className={classes.cardMediaEmpty}
            title="huga"
          >
          </CardMedia>
        }

        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {itemName}
          </Typography>
        </CardContent>
      </Link>
      {/* <CardActions> */}
      {/*   <Button size="small" color="primary"> */}
      {/*     <InfoIcon className={classes.icon} /> */}
      {/*       Info */}
      {/*   </Button> */}
      {/*   <Button size="small" color="primary"> */}
      {/*     <GetAppIcon className={classes.icon} /> */}
      {/*       Download */}
      {/*   </Button> */}
      {/* </CardActions> */}
    </Card>
  );
}

export {
  ItemCard,
};
