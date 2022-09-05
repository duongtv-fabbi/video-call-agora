<template>
  <div>
    <link
      href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      rel="stylesheet"
    />

    <div class="container">
      <div class="row clearfix">
        <div class="message-main">
          <div class="card chat-app">
            <div class="people">
              <div id="plist" class="people-list">
                <div class="input-group">
                  <div class="input-group-prepend">
                  <span class="input-group-text"
                  ><i class="fa fa-search"></i
                  ></span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search..."
                  />
                </div>
                <div class="add-room">
                  <!-- Button trigger modal -->
                  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    Add room
                  </button>
                  <!-- Modal -->
                  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog"
                       aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Room name</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div class="room">
                            <input type="text" v-model="room.name">
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                          <button type="submit" class="btn btn-primary" @click="createRoom">Save changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ul class="list-unstyled chat-list mt-2 mb-0">
                  <li class="clearfix" v-for="(room, index) in rooms" :key="index"
                      @click="joinRoom(room.roomId, room.name)"
                      :class="room.roomId === roomId ? 'active' : ''">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar1.png"
                      alt="avatar"
                    />
                    <div class="about">
                      <div class="name">{{ room.name }}</div>
                      <div class="status">
                        <i class="fa fa-circle offline"></i> left 7 mins ago
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div class="chat" v-if="roomId">
              <div class="chat-header clearfix">
                <div class="row">
                  <div class="col-lg-6">
                    <a
                      href="javascript:void(0);"
                      data-toggle="modal"
                      data-target="#view_info"
                    >
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                        alt="avatar"
                      />
                    </a>
                    <div class="chat-about">
                      <h6 class="m-b-0">{{ room.name }}</h6>
                      <small>Last seen: 2 hours ago</small>
                    </div>
                  </div>
                  <div class="col-lg-6 hidden-sm text-right">
                    <a
                      href="javascript:void(0);"
                      class="btn btn-outline-secondary"
                    ><i class="fa fa-camera" @click="videoCall()"></i
                    ></a>
                    <a
                      href="javascript:void(0);"
                      class="btn btn-outline-primary"
                    ><i class="fa fa-image"></i
                    ></a>
                    <a href="javascript:void(0);" class="btn btn-outline-info"
                    ><i class="fa fa-cogs"></i
                    ></a>
                    <a
                      href="javascript:void(0);"
                      class="btn btn-outline-warning"
                    ><i class="fa fa-question"></i
                    ></a>
                  </div>
                </div>
              </div>
              <div class="video-calling" id="video-calling">
                <div class="your-video-calling" id="your-video-calling"></div>
              </div>
              <div class="chat-history" id="chat-history">
                <ul class="m-b-0" v-if="messages.length > 0" id="list-message">
                  <li class="clearfix" v-for="(ms, index) in messages" :key="index">
                    <div class="message-data" :class="ms.sender == user.uid ? 'text-right' : ''">
                      <span class="message-data-time">{{ timeMessage(ms.createdAt) }}</span>
                      <img v-if="ms.sender == user.uid"
                           src="https://bootdey.com/img/Content/avatar/avatar7.png"
                           alt="avatar"
                      />
                    </div>
                    <div v-if="ms.imageUrl" class="message other-message"
                         :class="ms.sender != user.uid ? 'my-message image-mess image-mess-left' : 'float-right image-mess'">
                      <div class="message-image">
                        <img class="message-image"
                             :src="ms.imageUrl"
                             alt="">
                      </div>
                    </div>
                    <div class="message other-message" :class="ms.sender != user.uid ? 'my-message' : 'float-right'">
                      {{ ms.message }}
                    </div>
                  </li>
                </ul>
              </div>
              <div class="chat-message clearfix">
                <div class="preview-img">
                  <img
                    :src="tempUrl"
                    alt="">
                </div>
                <div class="input-group mb-0">
                  <div type="submit" class="input-group-prepend" @click="onSubmit()">
                    <span class="input-group-text"><i class="fa fa-send"></i></span>
                  </div>
                  <textarea @input="onInput()" id="send-message" placeholder="Enter text here..."
                            v-model="msg.message"></textarea>
                </div>
                <input type="file" ref="inputFile" @change="uploadFile">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../Firebase";
import { addDoc, query, collection, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import moment from "moment";
import { mapGetters } from "vuex";
import Vue from "vue";
import router from "@/router";
import AgoraRTC from "agora-rtc-sdk-ng";

export default {
  name: "Chat",
  data() {
    return {
      msg: { type: "", nickname: "", message: "", sender: "", roomId: "", createdAt: "", imageUrl: "" },
      messages: [],
      tempUrl: "",
      file: "",
      user: {},
      roomId: "",
      rooms: [],
      room: {
        name: "",
        roomId: "",
        createdAt: ""
      },
      rtc: {
        localAudioTrack: null,
        localVideoTrack: null,
        client: null
      },
      options: {
        appId: "0ece007cba7e4af4a1b7b8bb98f1c5a0",
        // Set the channel name.
        channel: "duong123",
        // Pass your temp token here.
        token: "007eJxTYJCZJ1wm3ZKX6bMyaFXqSTGb2ZwcBsItpjmOHh1TG2vWTFZgMEhNTjUwME9OSjRPNUlMM0k0TDJPskhKsrRIM0w2TTQITRRNvrpJLPluHgsTIwMEgvgcDCml+XnphkbGDAwA3JkfPg==",
        // Set the user ID.
        uid: new Date().getTime().toString()
      }
    };
  },
  async created() {
    // Create an AgoraRTCClient object.
    this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    this.rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event
      await this.rtc.client.subscribe(user, mediaType);
      console.log("subscribe success");

      // If the remote user publishes a video track.
      if (mediaType === "video") {
        // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const remotePlayerContainer = document.createElement("div");
        // Specify the ID of the DIV container. You can use the uid of the remote user.
        remotePlayerContainer.id = user.uid.toString();
        remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
        remotePlayerContainer.style.width = "100%";
        remotePlayerContainer.style.height = "100%";
        document.getElementById("video-calling").append(remotePlayerContainer);

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(remotePlayerContainer);
      }

      // If the remote user publishes an audio track.
      if (mediaType === "audio") {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        const remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }

      // Listen for the "user-unpublished" event
      this.rtc.client.on("user-unpublished", user => {
        // Get the dynamically created DIV container.
        const remotePlayerContainer = document.getElementById(user.uid);
        // Destroy the container.
        remotePlayerContainer.remove();
      });
    });

    //from your component
    this.roomId = this.$route.query.roomId ?? null;
    const orderByRooms = query(collection(firebase.db, "rooms"),
      orderBy("createdAt", "desc")
    );
    const querySnapshotRooms = await getDocs(orderByRooms);
    let self = this;
    self.rooms = [];
    querySnapshotRooms.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      self.rooms.push(doc.data());
    });
    if (this.roomId) {
      const roomNameArr = self.rooms.filter(room => this.roomId == room.roomId);
      this.room.name = roomNameArr[0].name;
    }
    let q = query(
      collection(firebase.db, "messages"),
      orderBy("createdAt", "asc"));

    await onSnapshot(q, async (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().roomId == this.roomId) {
          cities.push(doc.data());
        }
      });
      this.messages = cities;
    });

    await onSnapshot(orderByRooms, async (querySnapshotRooms) => {
      let self = this;
      self.rooms = [];
      querySnapshotRooms.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        self.rooms.push(doc.data());
      });
    });
  },
  async updated() {
    await this.scrollToElement();
  },

  computed: {
    ...mapGetters({
      userInfo: "getUser"
    })
  },
  watch: {
    async userInfo() {
      this.user = this.userInfo;
    }
  },
  methods: {
    async joinRoom(roomId, roomName) {
      this.roomId = roomId;
      this.room.name = roomName;
      if (roomId != this.$route.query.roomId) {
        this.messages = [];
        router.push({ name: "Chat", query: { roomId: roomId } });
        const orderByMessageRoomId = query(collection(firebase.db, "messages"),
          orderBy("createdAt", "asc")
        );
        const querySnapshotJoinRoom = await getDocs(orderByMessageRoomId);

        querySnapshotJoinRoom.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          if (doc.data().roomId == this.roomId) {
            this.messages.push(doc.data());
          }
        });
      }
    },

    async videoCall() {
      // Join an RTC channel.
      await this.rtc.client.join(this.options.appId, this.options.channel, this.options.token, this.options.uid);
      // Create a local audio track from the audio sampled by a microphone.
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Create a local video track from the video captured by a camera.
      this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      // Publish the local audio and video tracks to the RTC channel.
      await this.rtc.client.publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
      // Dynamically create a container in the form of a DIV element for playing the local video track.
      const localPlayerContainer = document.createElement("div");
      // Specify the ID of the DIV container. You can use the uid of the local user.
      localPlayerContainer.id = this.options.uid;
      localPlayerContainer.textContent = "Local user " + this.options.uid;
      localPlayerContainer.style.width = "100%";
      localPlayerContainer.style.height = "100%";
      document.getElementById("your-video-calling").append(localPlayerContainer);
      // Play the local video track.
      // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
      this.rtc.localVideoTrack.play(localPlayerContainer);
      console.log("publish success!");
    },

    async onSubmit() {
      this.msg.createdAt = new Date();
      this.msg.sender = this.user.uid;
      this.msg.roomId = this.roomId;
      if (this.file) {
        const storage = getStorage();
        const storageRef = ref(storage, this.makeId(10) + this.file.name);
        // 'file' comes from the Blob or File API
        await uploadBytes(storageRef, this.file).then((snapshot) => {
          getDownloadURL(ref(storage, snapshot.metadata.fullPath))
            .then(async (url) => {
              // `url` is the download URL for 'images/stars.jpg'
              this.msg.imageUrl = url;
              try {
                const docRef = await addDoc(collection(firebase.db, "messages"), this.msg);
                this.msg.message = "";
                this.msg.imageUrl = "";
                this.tempUrl = "";
                this.file = "";
                console.log("Document written with ID: ", docRef.id);
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            })
            .catch((error) => {
              console.log(error);
              // Handle any errors
            });
          console.log("Uploaded a blob or file!");
        });
      } else {
        try {
          const docRef = await addDoc(collection(firebase.db, "messages"), this.msg);
          this.msg.message = "";
          await this.onInput();
          this.msg.imageUrl = "";
          this.tempUrl = "";
          this.file = "";
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }


    },
    scrollToElement() {
      if (document.getElementById("list-message")) {
        document.getElementById("chat-history").scrollTop = document.getElementById("list-message").scrollHeight;
      }
    },
    timeMessage(timestamp) {
      return moment.unix(timestamp.seconds).format("dddd, h:mm:ss a");
    },
    makeId(length) {
      let result = "";
      let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
      }
      return result;
    },

    async createRoom() {
      this.room.createdAt = new Date();
      this.room.roomId = this.makeId(10);
      try {
        await addDoc(collection(firebase.db, "rooms"), this.room);
        this.room.name = "";
        Vue.$toast.open({
          message: "Create room success 1",
          type: "success",
          position: "top-right"
        });
      } catch (e) {
        console.error("Error adding document: ", e);
        Vue.$toast.open({
          message: e,
          type: "error",
          position: "top-right"
        });
      }
    },
    uploadFile(e) {
      const file = e.target.files[0];
      this.file = file;
      this.tempUrl = URL.createObjectURL(file);
    },


    onInput() {
      const tx = document.getElementById("send-message");
      if (tx.scrollHeight > 50) {
        tx.setAttribute("style", "height:" + (tx.scrollHeight) + "px;overflow-y:hidden;");
      }
      if (this.msg.message == "") {
        tx.setAttribute("style", "height:52" + "px;overflow-y:hidden;");
      }
    }
  }

};
</script>

<style>
.your-video-calling{
  width: 30%;
  right: 0;
  height: 19vh;
  background: red;
  position: absolute;
  z-index: 1;
}
.video-calling {
  width: 100%;
  height: 80vh;
  position: relative;
}

textarea {
  resize: none;
}

.message-image img {
  width: 15%;
}

.input-group-prepend {
  position: absolute;
  bottom: 13px;
  right: 10px;
}

.input-group-text {
  background-color: unset;
  border: unset;
  border-radius: 0.25rem;
}

#send-message {
  padding-right: 40px;
  width: 100%;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

body {
  background-color: #f4f7f6;
  margin-top: 20px;
}

.message-main {
  width: 100%;
}

.card {
  flex-direction: unset;
  background: #fff;
  transition: 0.5s;
  border: 0;
  margin-bottom: 30px;
  border-radius: 0.55rem;
  position: relative;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
}

.chat .chat-history .message {
  float: left;
}

.chat .chat-history .message-data {
  text-align: left;
}

.chat-app .people-list {
  position: sticky;
  left: 0;
  top: 0;
  padding: 0 20px 20px 20px;
  z-index: 7;
}

.chat-app .chat {
  border-left: 1px solid #eaeaea;
  width: 100%;
  max-height: calc(100vh - 100px);
  position: relative;
}

.people-list {
  -moz-transition: 0.5s;
  -o-transition: 0.5s;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.people-list .chat-list li {
  padding: 10px 15px;
  list-style: none;
  border-radius: 3px;
}

.people-list .chat-list li:hover {
  background: #efefef;
  cursor: pointer;
}

.people-list .chat-list li.active {
  background: #efefef;
}

.people-list .chat-list li .name {
  font-size: 15px;
}

.people-list .chat-list img {
  width: 45px;
  border-radius: 50%;
}

.people-list img {
  float: left;
  border-radius: 50%;
}

.people-list .about {
  float: left;
  padding-left: 8px;
}

.people-list .status {
  color: #999;
  font-size: 13px;
}

.chat .chat-header {
  padding: 15px 20px;
  border-bottom: 2px solid #f4f7f6;
}

.chat .chat-header img {
  float: left;
  border-radius: 40px;
  width: 40px;
}

.chat .chat-header .chat-about {
  float: left;
  padding-left: 10px;
}

.chat .chat-history {
  display: none;
  padding: 20px 20px 110px 20px;
  border-bottom: 2px solid #fff;
  max-height: calc(100vh - 180px);
  margin-bottom: 10px;
  overflow-y: auto;
}

.chat .chat-history ul {
  padding: 0;
}

.chat .chat-history ul li {
  list-style: none;
  margin-bottom: 30px;
}

.chat .chat-history ul li:last-child {
  margin-bottom: 0px;
}

input[type=text], input[type=password] {
  margin: unset !important;
}

.chat .chat-history .message-data {
  margin-bottom: 15px;
}

.chat .chat-history .message-data img {
  border-radius: 40px;
  width: 40px;
}

.chat .chat-history .message-data-time {
  color: #434651;
  padding-left: 6px;
}

.chat .chat-history .message {
  white-space: pre;
  color: #444;
  padding: 18px 20px;
  line-height: 26px;
  font-size: 16px;
  border-radius: 7px;
  display: inline-block;
  position: relative;
}

.chat .chat-history .message:after {
  bottom: 100%;
  left: 7%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-bottom-color: #fff;
  border-width: 10px;
  margin-left: -10px;
}

.chat .chat-history .my-message {
  background: #efefef;
}

.chat .chat-history .my-message:after {
  bottom: 100%;
  left: 30px;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-bottom-color: #efefef;
  border-width: 10px;
  margin-left: -10px;
}

.chat .chat-history .other-message {
  background: #e8f1f3;
  text-align: right;
}

.chat .chat-history .image-mess {
  background: unset;
  padding: 18px 0;
  width: 100%;
}

.chat .chat-history .image-mess img {
  min-height: 95px;
}

.chat .chat-history .image-mess-left {
  text-align: left;
}

.chat .chat-history .image-mess:after {
  content: unset;
}

.chat .chat-history .other-message:after {
  border-bottom-color: #e8f1f3;
  left: 20px;
}

.chat .chat-history .float-right:after {
  border-bottom-color: #e8f1f3;
  right: 15px;
  left: unset;
}

.chat .chat-message {
  position: absolute;
  padding: 0 20px 20px 20px;
  background: #dbdbdba6;
  border-radius: 10px;
  padding: 5px 0;
  bottom: 0;
  width: 100%;
}

.preview-img img {
  width: 25%;
}

.online,
.offline,
.me {
  margin-right: 2px;
  font-size: 8px;
  vertical-align: middle;
}

.online {
  color: #86c541;
}

.offline {
  color: #e47297;
}

.me {
  color: #1d8ecd;
}

.float-right {
  float: right;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " vc";
  clear: both;
  height: 0;
}

@media only screen and (max-width: 767px) {
  .chat-app .people-list {
    height: 465px;
    width: 100%;
    overflow-x: auto;
    background: #fff;
    left: -400px;
    display: none;
  }

  .chat-app .people-list.open {
    left: 0;
  }

  .chat-app .chat {
    margin: 0;
  }

  .chat-app .chat .chat-header {
    border-radius: 0.55rem 0.55rem 0 0;
  }

  .chat-app .chat-history {
    height: 300px;
    overflow-x: auto;
  }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
  .chat-app .chat-list {
    height: 650px;
    overflow-x: auto;
  }

  .chat-app .chat-history {
    height: 600px;
    overflow-x: auto;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
  .chat-app .chat-list {
    height: 480px;
    overflow-x: auto;
  }

  .chat-app .chat-history {
    height: calc(100vh - 350px);
    overflow-x: auto;
  }
}
</style>
