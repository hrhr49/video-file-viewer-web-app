import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import TheatersIcon from '@material-ui/icons/Theaters';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
}));

const CustomAppBar: React.FC<{}> = (
) => {
  const classes = useStyles();

  return (
    <AppBar position="relative">
      <Toolbar>
        <TheatersIcon className={classes.icon} />
        <Typography variant="h6" color="inherit" noWrap>
          Video Browser
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export {
  CustomAppBar
};
