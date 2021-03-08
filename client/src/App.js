import React from 'react';
// import config from './config';
import io from 'socket.io-client';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import apple from "./apple.png"

import BottomBar from './BottomBar';
import './App.css';

// import female from './female.jpg'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      content: '',
      name: '',
      chat_message: '',
      uploaded_file: null,
      imageBase64: '',
    };
  }

  componentDidMount() {
    this.socket = io();

    this.socket.on('uploaded image', (image) => {
      
      // this.getBase64(image, (result) => {
      //   this.setState({
      //     imageBase64: result
      //   })
      // })

      this.setState({
        uploaded_file: image
      })
    })

    // Load the last 10 messages in the window.
    this.socket.on('init', (msg) => {
      let msgReversed = msg.reverse();
      this.setState((state) => ({
        chat: [...state.chat, ...msgReversed],
      }), this.scrollToBottom);
    });

    // Update the chat if a new message is broadcasted.
    this.socket.on('push', (msg) => {
      this.setState((state) => ({
        chat: [...state.chat, msg],
      }), this.scrollToBottom);
    });
    
    // this.socket.on('cm', (msg) => {
    //   this.setState((state) => ({
    //     chat: [...state.chat, {
    //       chat_message: msg
    //     }],
    //   }))
    // })

    // this.socket.on('cm', (msg) => {
    //   this.setState({chat_message: msg})
    // })
  }

  // Save the message the user is typing in the input field.
  handleContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  //
  handleName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  getBase64 = (file, cb) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function() {
        cb(reader.result)
    }
    reader.onerror = function(error) {
        console.log('Error: ', error)
    }
  }

  handleSubmit(event) {
    // Prevent the form to reload the current page.
    event.preventDefault();

    // Send the new message to the server.
    this.socket.emit('message', {
      name: this.state.name,
      content: this.state.content,
    });

    this.setState((state) => {
      // Update the chat with the user's message and remove the current message.
      return {
        chat: [...state.chat, {
          name: state.name,
          content: state.content,
        }],
        content: '',
      };
    }, this.scrollToBottom);
  }

  // Always make sure the window is scrolled down to the last message.
  scrollToBottom() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }

  render() {
    // var apple = require("./apple.png")

    // console.log(this.state.chat.chat_message, 'hi')
    // console.log(this.state.chat_message)
    // console.log(this.state.uploaded_file)
    // console.log(typeof female)
    // console.log(this.state.imageBase64)

    return (
      <div>

        {/* <div>
          <input type="submit"/>
        </div> */}
        {/* <img src={this.state.uploaded_file}/> */}

        <Paper id="chat" elevation={3}>
          {this.state.chat.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {el.name}
                </Typography>
                <Typography variant="body1" className="content">
                  {el.content}
                </Typography>
                {/* {el.image ? <img src={} style={{height: "200px", width: "200px"}} /> : ''} */}
                {/* {<img src="https://myawsbucketnavu.s3.ap-south-1.amazonaws.com/Naveen+Perpaga_283635.pdf" style={{height: "200px", width: "200px"}}/>} */}

                {/* {<video
                  src="https://myawsbucketnavu.s3.ap-south-1.amazonaws.com/video.mp4"
                  type="video/mp4"
                  style={{width: "400px", height: "400px"}}
                />} */}

                
                {<video style={{width: "320px", height: "240px"}} controls>
                  <source src="https://myawsbucketnavu.s3.ap-south-1.amazonaws.com/video.mp4" type="video/mp4"/>
                </video>}
                

                {/* {el.image ? <embed src={el.image} style={{height: "200px", width: "200px"}}/> : ''} */}
                <Typography>
                  {el.chat_message ? el.chat_message : ''}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <BottomBar
          content={this.state.content}
          handleContent={this.handleContent.bind(this)}
          handleName={this.handleName.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          name={this.state.name}
        />
      </div>
    );
  }
};

export default App;