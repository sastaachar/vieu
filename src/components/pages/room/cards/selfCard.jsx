import React, { useRef, useState } from "react";

import MovableCard from "../../../shared/movableCard";
import { connect } from "react-redux";
import { useEffect } from "react";
import { updateStreamState } from "../../../../actions/streamActions";

const SelfCard = (props) => {
  const videoNode = useRef(null);

  //const [panner, setPan] = useState(null);

  useEffect(() => {
    if (videoNode.current && props.stream) {
      videoNode.current.srcObject = props.stream;
      console.log("got new stream");
    }
  }, [props.stream]);

  const changeVideoState = () => {
    const { stream: userStream, streamState } = props;
    try {
      if (streamState.video) {
        // video is on turn it off
        userStream.getVideoTracks()[0].stop();
        props.updateStreamState({
          audio: streamState.audio,
          video: !streamState.video,
        });
      } else {
        // video is off turn it on
        const getMedia = navigator.mediaDevices.getUserMedia({
          audio: streamState.audio,
          video: true,
        });

        getMedia
          .then((stream) => {
            // disable all previous streams
            if (userStream)
              userStream.getTracks().forEach((track) => {
                track.stop();
              });

            // send every one new stream
            Object.entries(props.senders).forEach((value) => {
              const sender = value[1][0];
              stream.getTracks().forEach((track) => {
                if (track.kind === sender.track.kind) {
                  sender
                    .replaceTrack(track)
                    .then(() => {
                      console.log(`Replaced ${track.kind} track`);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              });
            });
            // change stream state
            props.updateStreamState({
              audio: streamState.audio,
              video: !streamState.video,
            });
            // need to replace my current stream with new one
            props.setMyStream(stream);
          })
          .catch((e) => {
            console.log("Could not access your camera or microphone");
            return;
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeState = (kind) => {
    try {
      // flip the state of kind
      const { stream: userStream, streamState } = props;

      // if kind is on
      if (streamState[kind]) {
        userStream.getTracks().forEach((track) => {
          if (track.kind === kind) track.stop();
        });
        // update local state
        props.updateStreamState({
          audio: streamState.audio,
          video: !streamState.video,
        });
        // update remote state
        // socket calls
      } else {
        const other = kind === "video" ? "audio" : "video";

        // preserve other kind's state and flip current's state
        const getMedia = navigator.mediaDevices.getUserMedia({
          [kind]: !streamState[kind],
          [other]: streamState[other],
        });

        getMedia
          .then((stream) => {
            // replace all senders stream
            const { senders, members } = props;
            const allStream = stream.getTracks();
            let kindTrack, otherTrack;
            allStream.forEach((track) => {
              if (track.kind === kind) kindTrack = track;
              else otherTrack = track;
            });

            // we need to send/replace our tracks
            // for all our users
            // TODO :- filter bloacked users
            members.forEach(({ user_id }) => {
              if (senders[user_id]) {
              } else {
              }
            });

            let trackExists = false;
            const trackUpdates = [];
            // replace senders tracks
            for (const id in senders) {
              const sender = senders[id][0];
              if (sender.track.kind === other) {
                trackUpdates.push(sender.replaceTrack(otherTrack));
              } else {
                trackExists = true;
                trackUpdates.push(sender.replaceTrack(kindTrack));
              }
            }

            // sending for first time
            if (!trackExists) {
              for (const id in senders) {
                const sender = senders[id][0];
                sender.addTrack(kindTrack);
              }
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      if (err instanceof MediaError) {
        alert("Device not available");
      } else {
        console.log(err);
      }
    }
  };

  const changeAudioState = () => {
    const { stream: userStream, streamState } = props;
    try {
      if (streamState.audio) {
        // video is on turn it off
        userStream.getAudioTracks()[0].stop();
        // chagne state
        props.updateStreamState({
          audio: !streamState.audio,
          video: streamState.video,
        });
      } else {
        // video is off turn it on
        const getMedia = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: streamState.video,
        });
        getMedia
          .then((stream) => {
            // disable all previous streams
            if (userStream)
              userStream.getTracks().forEach((track) => {
                track.stop();
              });

            // send every one new stream
            Object.entries(props.senders).forEach((value) => {
              const sender = value[1][0];

              const audioTracks = stream.getAudioTracks();

              audioTracks.forEach((track) => {
                console.log(sender.track);
                if (track.kind === sender.track.kind) {
                  sender
                    .replaceTrack(track)
                    .then(() => {
                      console.log(`Replaced ${track.kind} track`);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              });
            });
            // chagne state
            props.updateStreamState({
              audio: !streamState.audio,
              video: streamState.video,
            });
            // need to replace my current stream with new one
            props.setMyStream(stream);
          })
          .catch((e) => {
            console.log(e);
            console.log("Could not access your camera or microphone");
            return;
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MovableCard>
      <div className="cardContainer">
        <video playsInline autoPlay ref={videoNode} />
        {props.streamState.video ? <span>v</span> : null}
        {props.streamState.audio ? <span>a</span> : null}
        <div className="card-btnContainter">
          <button onClick={changeVideoState}>video</button>
          <button onClick={changeAudioState}>audio</button>
        </div>
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({
  streamState: state.streamData,
  members: state.roomData.members,
});

export default connect(mapStateToProps, { updateStreamState })(SelfCard);
