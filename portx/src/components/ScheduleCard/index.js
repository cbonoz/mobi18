import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
  card: {
    maxWidth: 350,
    display: 'inline-block'
  },
  actions: {
    display: 'flex',
    padding: '0px',
    height: '10px'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    position: 'relative',
    bottom: '20px',
    textAlign: 'left'
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  header: {
    textAlign: 'left'
  },
  content: {
    padding: '0px'
  },
  expandContent: {
    textAlign: 'left',
    overflowWrap: 'break-word'
  }
});

class RecipeReviewCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, booking } = this.props;

    const startTime = new Date(booking.startTime)

    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          avatar={
            <Avatar aria-label="Truck" className={classes.avatar}>
              <i class="fas fa-truck-moving"></i>
            </Avatar>
          }
          title={startTime.toGMTString()}
          subheader={`Terminal: ${booking.terminal}`}
        />
        <CardContent className={classes.content}>
          <Typography component="p">
            {booking.description}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.expandContent}>
            <strong>Owner</strong>: {booking.owner}
            <br/>
            <strong>End Time</strong>: {(new Date(booking.endTime)).toGMTString()}
            <br/>
            <strong>Signer</strong>: {booking.signer}
            <br/>
            <strong>Notary</strong>: {booking.notary}
            <br/>
            <strong>Hash</strong>: {booking.hash}
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);