<img src="./__docs/logo.png" style="margin : 0% 50%">

## Description

Vieu is a video chat application made using [React](https://reactjs.org/) powered by [webRTC](https://webrtc.org/), and uses [socket.io](https://socket.io/) as the signaling server on the [backend](https://github.com/sastaachar/vieu-server).

Webrtc natively supports peer-to-peer connection, and to accommodate a chat room experience , i've used a mesh architecture.

<img src="./__docs/mesh.png" style="width : 500px; margin : 0% 50% ">

This type of architecture is not al all scalable, but since this project was made just for experimental purposes i've used this here , although for better scalability and performance a Selective Forwarding Unit or Multipoint Conferencing Unit can be considered, for more info check [here](https://www.callstats.io/blog/webrtc-architectures-explained-in-5-minutes-or-less).

<img src="https://user-images.githubusercontent.com/42416647/103297603-a5703280-4a1e-11eb-9968-abd6ffc8e534.gif" style="margin : 0% 50%">

The global state of the application is managed using Redux.

## Pages

### Main (landing)

<img src="./__docs/landing.png" style="margin : 0% 50%">

### Join Room

<img src="./__docs/joinRoom.png" style="margin : 0% 50%">

### Chat Room

<img src="./__docs/chatRoom1.png" style="margin : 0% 50%">

<img src="./__docs/chatRoom2.png" style="margin : 0% 50%">
