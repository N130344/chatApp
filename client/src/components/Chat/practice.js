import React, { Component } from 'react'
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;
export default class practice extends Component {
    constructor(props){
        super(props);
        this.state = {
            name : '',
            room : '',
            users: '',
            message : '',
            messages: []
        }
        this.ENDPOINT = '192.168.1.10:5000'
    }
    componentDidMount() {
        const { name, room } = queryString.parse(this.props.location.search);

        socket = io(ENDPOINT);
        this.setState({
            room ,
            name
        })
        // setRoom(room);
        // setName(name)
        socket.emit('join', { name, room }, (error) => {
            if(error) {
              alert(error);
            }
          });

          socket.on('message', (message) => {
            this.setState({messages : [...this.state.messages, message ]});
          });
      
          socket.on('roomData', ({ users }) => {
            this.setState({
                users 
            })
            // setUsers(users);
          })

    }
    componentWillUnmount() {
        socket.emit('disconnect');
      
        socket.off();
    }

    sendMessage = (event) => {
        event.preventDefault();
    
        if(this.state.message) {
          socket.emit('sendMessage', message, () => this.setState({
              message : ''
          }));
        }
      }
      setMessage = (message) => {
        this.setState({
            message
        })
      }
    render() {
        return (
            <div className="outerContainer">
                <div className="container">
                    <InfoBar room={this.state.room} />
                    <Messages messages={this.state.messages} name={this.state.name} />
                    <Input message={this.state.message} setMessage={this.setMessage} sendMessage={this.sendMessage} />
                </div>
                <TextContainer users={this.state.users} />
            </div>
        )
    }
}


import './Input.css';
class Input extends Component {
    constructor(props){
        super(props);
        this.state  = {}
    }
    render() {
        return (
            <form className="form">
            <input
              className="input"
              type="text"
              placeholder="Type a message..."
              value={this.props.message}
              onChange={({ target: { value } }) => this.props.setMessage(value)}
              onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
            />
            <button className="sendButton" onClick={e => this.props.sendMessage(e)}>Send</button>
          </form>
        )
    }

}
