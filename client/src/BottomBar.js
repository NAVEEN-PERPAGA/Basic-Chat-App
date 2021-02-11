import React, {useState} from 'react';
import {PopUp} from './popup'
import {FileUpload} from './fileUpload'

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';

import ChatIcon from '@material-ui/icons/Chat';
import FaceIcon from '@material-ui/icons/Face';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const useStyles = makeStyles(theme => ({
  appBar: {
    bottom: 0,
    top: 'auto',
  },
  inputContainer: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    marginLeft: theme.spacing(1),
    position: 'relative',
    width: '100%',
  },
  icon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    width: '100%',
  },
}));

export default function BottomBar(props) {
  const [isOpen, setIsOpen] = useState(false)
  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <div className={classes.inputContainer} style={{maxWidth: '200px'}}>
          <div className={classes.icon}>
            <FaceIcon />
          </div>
          <InputBase
            onChange={props.handleName}
            value={props.name}
            placeholder="Name"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'name' }}
          />
        </div>
        <div className={classes.inputContainer}>
          <form onSubmit={props.handleSubmit}>
            <div className={classes.icon}>
              <ChatIcon />
            </div>
            <InputBase
              onChange={props.handleContent}
              value={props.content}
              placeholder="Type your message..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'content' }}
            />
          </form>
          
        </div>
        <div>
          {/* <input
            type="button"
            onClick = {togglePopup}
          /> */}
          <button onClick={togglePopup}>
            <AttachFileIcon/>
          </button>
          {
            isOpen && <PopUp
              handleClose = {togglePopup}
            >
                  {/* <b>SELECT A FILE TO UPLOAD</b><br/>
                  <input
                    type='file'
                  /><br/><br/>
                  <button>UPLOAD</button> */}
                  <FileUpload/>
            </PopUp>
          }
        </div>
      </Toolbar>
    </AppBar>
  );
}