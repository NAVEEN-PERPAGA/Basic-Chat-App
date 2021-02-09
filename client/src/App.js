import React from 'react'
import BottomBar from './BottomBar';
import Chat from './Chat'


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showResults: false
    }
  }

chatBtn() {
  this.setState({ showResults: true})
}

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4"> <Chat /></div>
          <div className="col-md-6"> 
            <input
              type="submit"
              value="OpenChat"
              onClick={this.chatBtn.bind(this)}
            />
            {this.state.showResults ? (
              <Chat />
            ) : null}
          </div>
          </div>
          <div>
        </div>
      </div>
    )
  }
}