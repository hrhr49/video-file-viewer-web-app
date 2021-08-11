import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

interface ICustomBreadcrumsProps {
  texts: string[];
  onChange: (texts: string[]) => void;
}

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    margin: theme.spacing(2),
  },
  breadcrumbs: {
    display: 'inline-block',
    margin: 'auto',
  },
  iconButton: {
    display: 'inline-block',
  }
}));

const CustomBreadcrums: React.FC<ICustomBreadcrumsProps> = ({
  texts,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <div role="presentation" className={classes.breadcrumbsContainer} >
      <Breadcrumbs 
        aria-label="breadcrumb"
        className={classes.breadcrumbs}
      >
        {texts.map((text, i) => (
          <Link
            underline="hover"
            color="inherit"
            onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
              event.preventDefault();
              onChange(texts.slice(0, i + 1));
            }}
            key={texts.slice(0, i + 1).join('/')}
          >
            <Typography color="primary">
              {text}
            </Typography>
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}

export {
  CustomBreadcrums,
};
