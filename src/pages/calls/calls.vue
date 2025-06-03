<template>
  <view class="calls" :style="callStyle">
    <video :controls="false" object-fit="cover" :show-center-play-btn="false" :style="localStyle" class="localVideo" autoplay playsinline @click="changeStyle('local')"></video>
    <video :controls="false" object-fit="cover" :show-center-play-btn="false" :style="remoteStyle" class="remoteVideo"  autoplay playsinline @click="changeStyle('local')"></video>
    <!-- <button @click="start()">start</button>
		<button @click="leave()">leave</button> -->
    <view class="leave1" @click.stop="start()">
      <image class="image1" src="@/static/img/chat/leave.svg" />
    </view>
    <view class="leave" @click="leave()">
      <image class="image" src="@/static/img/chat/leave.svg" />
    </view>
  </view>
</template>
<script lang="ts">
	import { defineComponent, onMounted, reactive, ref, watch } from "vue";
	import wsManager from "@/ws-manager/ws";
  import emitter from '@/utils/mitt';
  import {cStyle,lStyle,rStyle} from './data'
	export default defineComponent({
    props: {
    conversationId: {
      type: String,
      default: "",
    },
  },
		setup(props) {
			let localVideo : HTMLVideoElement;
			let remoteVideo : HTMLVideoElement;
      const isDragging = ref(false)
			const pcConfig = {
				iceServers: [
					{
						urls: "stun.l.google.com:19302",
					},
				],
			};
			let localStream : MediaStream | null;
			let remoteStream : MediaStream | null;
			let peer : RTCPeerConnection | null;
			let state = ref("join");
			const roomId = props.conversationId
			const callStyle = reactive(cStyle);
			const localStyle = reactive(lStyle);
			const remoteStyle = reactive(rStyle);
			const getAnswer = (desc) => {
				peer.setLocalDescription(desc);
				sendMessage(roomId, desc);
			};
			const getOffer = (desc) => {
				peer.setLocalDescription(desc);
				sendMessage(roomId, desc);
			};
			const handleOfferError = () => {
				console.log("handleOfferError");
			};
			const handleAnswerError = (e) => {
				console.log("handleAnswerError", e);
			};
			const sendMessage = (roomId, data) => {
				let obj = {
					command: "COMMON_PROXY_MESSAGE",
					content: {
						timestamp: 1234,
						data: {
							type: "transform_websocket_message",
							conversationId: roomId,
							body: {
								msg: data,
							},
						},
					},
				};
				wsManager._sendMessage(obj);
			};
			const getRemoteStream = (e) => {
				console.log(e, "recevice ontrack!!!!");
				remoteStream = e.streams[0];
				remoteVideo.srcObject = remoteStream;
			};
			const call = () => {
				let offerOptions = {
					offerToReceiveAudio: true,
					offerToReceiveVideo: true,
				};
				peer.createOffer(offerOptions).then(getOffer).catch(handleOfferError);
			};
			const createPeerConnection = () => {
				console.log("createPeer");
				peer = new RTCPeerConnection();
				//监听ICE候选
				peer.onicecandidate = (e) => {
					if (e.candidate) {
						let obj = {
							type: "candidate",
							label: e.candidate.sdpMLineIndex,
							id: e.candidate.sdpMid,
							candidate: e.candidate.candidate,
						};
						sendMessage(roomId, obj);
					} else {
						console.log("candidate end");
					}
				};
				peer.oniceconnectionstatechange = () => {
					console.log("ICE connection state changed:", peer.iceConnectionState);
					if (peer.iceConnectionState === "connected") {
						console.log("P2P connection established!");
					} else if (peer.iceConnectionState === "failed") {
						console.log("P2P connection failed!");
					} 
				};
				//监听远程流
				peer.ontrack = getRemoteStream;
				if (state.value === "joined_connect") {
					call();
					let objs = {
						type: "otherJoin",
					};
					sendMessage(roomId, objs);
				}
			};
			const join = () => {
				let objs = {
					type: "join",
				};
				sendMessage(roomId, objs);
			};
			const othenJoin = () => {
				start();
			};
			const closeLocalMedia = () => {
				if (localStream && localStream.getTracks()) {
					localStream.getTracks().forEach((track) => {
						track.stop();
					});
				}
				if (remoteStream && remoteStream.getTracks()) {
					remoteStream.getTracks().forEach((track) => {
						track.stop();
					});
				}
				localStream = null;
				remoteStream = null
			};
			const leave = () => {
        if(!peer){
          return
        }
				let objs = {
					type: "leave",
				};
				sendMessage(roomId, objs);
				peer.close();
				peer = null;
				closeLocalMedia()
        emitter.emit('changeCall', false)

			};
			const connect = () => {
				createPeerConnection();
				bindTracks();
			};
			const bindTracks = () => {
				//将本地流添加到peerConnection
				localStream &&
					localStream.getTracks().forEach((track) => {
						peer.addTrack(track, localStream);
					});
				console.log(localStream);
			};
			const getMediaStream = (stream) => {
				// localStream = stream;
				// localVideo.srcObject = stream;
				console.log(state.value, "stream");
				if (localStream) {
					stream.getAudioTracks().forEach((track) => {
						localStream.addTrack(track);
						stream.removeTrack(track);
					});
				} else {
					localStream = stream;
				}
				localVideo.srcObject = stream;
				if (state.value === "join") {
					join();
				}
				connect();
			};
			const handleError = (e) => {
				console.error("media eror", e);
			};
			const start = () => {
				if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
					console.log("this devices not supported media!");
					return;
				} else {
					const constraints = {
						video: state.value !== "joined_connect",
						audio: true,
					};
					console.log(constraints);

					navigator.mediaDevices
						.getUserMedia(constraints)
						.then(getMediaStream)
						.catch(handleError);
				}
			};
			const handleMessage = (event) => {
				if (!event.data) {
					return;
				}
				let data = JSON.parse(event.data).content.data.body.msg;
				if (JSON.parse(event.data).command === "COMMON_PROXY_MESSAGE") {
					if (data.type === "offer") {
						peer.setRemoteDescription(new RTCSessionDescription(data));
						peer.createAnswer().then(getAnswer).catch(handleAnswerError);
					} else if (data.type === "answer") {
						peer.setRemoteDescription(new RTCSessionDescription(data));
					} else if (data.type === "candidate") {
						let candidate = new RTCIceCandidate({
							sdpMLineIndex: data.label,
							candidate: data.candidate,
						});
						peer.addIceCandidate(candidate);
					} else if (data.type === "join") {
						state.value = "joined_connect";
						start();
					} else if (data.type === "otherJoin") {
						state.value = "joined_connect_other";
					} else if (data.type === 'leave') {
						leave()
					}
				}
			};
      const changeStyle = (type)=>{
        let OLStyle = JSON.parse(JSON.stringify(lStyle))
        let ORStyle = JSON.parse(JSON.stringify(rStyle))
        if(type === 'local'){
          Object.keys(localStyle).forEach(key=>{
            localStyle[key] = ORStyle[key]
          })
          Object.keys(remoteStyle).forEach(key=>{
            remoteStyle[key] = OLStyle[key]
          })
          // remoteStyle = lStyle
        }else if(type === 'remote'){
          Object.keys(localStyle).forEach(key=>{
            localStyle[key] = ORStyle[key]
            console.log(localStyle[key],ORStyle[key]);
          })
          Object.keys(remoteStyle).forEach(key=>{
            remoteStyle[key] = OLStyle[key]
            console.log(remoteStyle[key],OLStyle[key]);
            
          })
        }
        console.log(localStyle,remoteStyle,OLStyle,ORStyle);
        
      }

    onMounted(() => {
				localVideo = document
					.getElementsByClassName("localVideo")[0]
					.getElementsByTagName("video")[0];
				remoteVideo = document
					.getElementsByClassName("remoteVideo")[0]
					.getElementsByTagName("video")[0];
				wsManager.setMessageCallback(handleMessage);
			});
			return {
				callStyle,
				localStyle,
				remoteStyle,
				start,
				leave,
        changeStyle,
			};
		},
	});
</script>
<style lang="scss" scoped>
.calls {
  position: fixed;
  width: var(--w);
  height: var(--h);
  top: var(--t);
  left: var(--l);
  z-index: 2000;
  background-color: #ccc;
  color: #000;
  display: flex;
  flex-direction: column;

  .localVideo {
    position: absolute;
    width: var(--w);
    height: var(--h);
    top: var(--t);
    // left: var(--l);
    right: var(--r);
    z-index: var(--index);
  }

  .remoteVideo {
    // display: var(--none);
    position: absolute;
    width: var(--w);
    height: var(--h);
    top: 50%;
    z-index: var(--index);
    top: var(--t);
    // left: var(--l);
    right: var(--r);
    :deep(.uni-video-container){
      background-color: red;
    }
  }

  .remoteVideo :deep(.uni-video-cover) {
    background-color: red;
  }
  .leave {
    position: absolute;
    width: 100rpx;
    height: 100rpx;
    background-color: red;
    border-radius: 50%;
    bottom: 100rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3000;
    display: flex;
    justify-content: center;
    align-items: center;
    .image {
      width: 80rpx;
      height: 80rpx;
    }
  }
  .leave1 {
    position: absolute;
    width: 100rpx;
    height: 100rpx;
    background-color: red;
    border-radius: 50%;
    bottom: 100rpx;
    left: 30%;
    transform: translateX(-50%);
    z-index: 3000;
    display: flex;
    justify-content: center;
    align-items: center;

    .image1 {
      width: 80rpx;
      height: 80rpx;
    }
  }
}
</style>