import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  pagination: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  paginationContent: {
    display: 'inline-block',
  },
}));

interface ICustomPaginationProps {
  count: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const CustomPagination: React.FC<ICustomPaginationProps> = ({
  count,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.pagination} >
      <Pagination 
        count={count} 
        color="primary" 
        onChange={onChange}
        className={classes.paginationContent}
      />
    </div>
  );
}

export {
  CustomPagination,
};
