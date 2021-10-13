<template>
  <div>
    <h2 class="left-align">Agora Video Web SDK Quickstart</h2>
    <div class="row">
      <div>
        <button class="btn btn-success" type="button" id="join" @click="joinAgora">JOIN</button>
        <!--        <button class="btn-success." type="button" id="leave">LEAVE</button>-->
      </div>
      <div id="livestream">
        <div class="container">
          <div class="col-12">
            <div class="main">
              <div class="background" id="background">
                <img src="../assets/logo.png" alt="">
              </div>
              <div class="mask" id="mask">
                <!--                <img src="../assets/mask.png" alt="">-->
                <div class="mask-bar">
                  <img src="../assets/icons/dot.svg" alt="">
                </div>
              </div>
              <div class="active-icon">
                <div class="speaker">
                  <img @click="offSpeaker" v-if="device.speaker" src="../assets/icons/speaker.svg" alt="">
                  <img @click="offSpeaker" v-else src="../assets/icons/off-speaker.svg" alt="">
                </div>
                <div class="device">
                  <ul>
                    <li>
                      <img @click="onShare" src="../assets/icons/share.svg" alt="" v-if="device.share">
                      <img @click="offShare" src="../assets/icons/off-share.svg" alt="" v-else>
                    </li>
                    <li>
                      <img @click="offCam" src="../assets/icons/cam.svg" alt="" v-if="device.camera">
                      <img @click="offCam" src="../assets/icons/off-cam.svg" alt="" v-else>
                    </li>
                    <li>
                      <img @click="offMic" src="../assets/icons/mic.svg" alt="" v-if="device.mic">
                      <img @click="offMic" src="../assets/icons/off-mic.svg" alt="" v-else>
                    </li>
                    <li>
                      <img @click="offCall" src="../assets/icons/call.svg" alt="">
                    </li>
                    <li>
                      <img @click="offFullScreen" src="../assets/icons/full-screen.svg" alt="" v-if="device.fullScreen">
                      <img @click="offFullScreen" src="../assets/icons/exit-fullscreen.svg" alt="" v-else>
                    </li>
                  </ul>
                </div>
                <div class="device-hidden"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="device-hidden"></div>
      </div>
    </div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk-ng";

export default {
  data() {
    return {
      device: {
        speaker: false,
        share: false,
        camera: false,
        mic: false,
        fullScreen: false,
      },
      rtc: {
        localAudioTrack: null,
        localVideoTrack: null,
        client: null,
        screenTrack: null,
      },
      options: {
        appId: "8b8d89ed1b09437aa1ad8016020f83d4",
        // Set the channel name.
        channel: "duong123",
        // Pass your temp token here.
        token: "00687bcd4532cbc4843bf407779d4b1a5a2IACh7x+mB5S5DqI2fk/dmzNxZX+WDvst6KuHeetcO058TX2Pi4EAAAAAEADjpwys3k5pYQEAAQDeTmlh",
        // Set the user ID.
        uid: new Date().getTime().toString()
      },
      screenClient: AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8'
      })
    }
  },
  mounted() {
    this.rtc.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    console.log(this.rtc.client)
    this.rtc.client.on("user-published", this.userPublish);
  },
  methods: {
    offShare() {
      this.device.share = !this.device.share;
    },
    onShare() {
      this.device.share = !this.device.share;
      this.screenClient.init(this.options.appId, function () {
        this.screenClient.join(this.options.token, this.options.channel, null, function (uid) {
          // Create the stream for screen sharing.
          const streamSpec = {
            streamID: uid,
            audio: false,
            video: false,
            screen: true
          }
          // Set relevant properties according to the browser.
          // Note that you need to implement isFirefox and isCompatibleChrome.
          streamSpec.mediaSource = 'window';
          // if (isFirefox()) {
          //   streamSpec.mediaSource = 'window';
          // } else if (!isCompatibleChrome()) {
          //   streamSpec.extensionId = 'minllpmhdgpndnkomcoccfekfegnlikg';
          // }
          let screenStream = AgoraRTC.createStream(streamSpec);
          // Initialize the stream.
          screenStream.init(function () {
            // Play the stream.
            screenStream.play('Screen');
            // Publish the stream.
            this.screenClient.publish(screenStream);

          }, function (err) {
            console.log(err);
          });

        }, function (err) {
          console.log(err);
        })
      });
    },
    offCam() {
      this.device.camera = !this.device.camera;
    },
    offMic() {
      this.device.mic = !this.device.mic;
    },
    async offCall() {
      await this.rtc.client.leave();
      await this.rtc.screenTrack.close();

    },
    offFullScreen() {
      this.device.fullScreen = !this.device.fullScreen;
    },
    offSpeaker() {
      this.device.speaker = !this.device.speaker;
    },

    async userPublish(user, mediaType) {
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
        remotePlayerContainer.class = 'user-public';
        // remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
        remotePlayerContainer.style.width = "100%";
        remotePlayerContainer.style.height = "100%";
        document.getElementById("mask").append(remotePlayerContainer);

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(remotePlayerContainer);

        // Or just pass the ID of the DIV container.
        // remoteVideoTrack.play(playerContainer.id);
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
    },
    async joinAgora() {
      // Join an RTC channel.
      await this.rtc.client.join(this.options.appId, this.options.channel, this.options.token, this.options.uid);
      // Create a local audio track from the audio sampled by a microphone.
      // this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Create a local video track from the video captured by a camera.
      // this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      try {
        this.rtc.screenTrack = await AgoraRTC.createScreenVideoTrack({
          // Set the encoder configurations. For details, see the API description.
          encoderConfig: "1080p_1",
          // Set the video transmission optimization mode as prioritizing video quality.
          optimizationMode: "detail"
        });
      } catch (e) {
        alert('abcd')
      }
      // Publish the local audio and video tracks to the RTC channel.
      // await this.rtc.client.publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
      await this.rtc.client.publish([this.rtc.screenTrack]);
      // Dynamically create a container in the form of a DIV element for playing the local video track.
      const localPlayerContainer = document.createElement("div");
      // Specify the ID of the DIV container. You can use the uid of the local user.
      localPlayerContainer.id = this.options.uid;
      localPlayerContainer.class = 'video-user';
      // localPlayerContainer.textContent = "Local user " + this.options.uid;
      localPlayerContainer.style.width = "100%";
      localPlayerContainer.style.height = "100%";
      localPlayerContainer.style.position = "absolute";
      localPlayerContainer.style.bottom = "0";
      document.getElementById("background").append(localPlayerContainer);

      // Play the local video track.
      // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
      // this.rtc.localVideoTrack.play(localPlayerContainer);
      this.rtc.screenTrack.play(localPlayerContainer);
      console.log("publish success!");
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.livestream {
  border: 1px solid #111;
}

.main {
  position: relative;

  video {
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
  }

  .background {
    min-width: 1092px;
    min-height: 614px;
  }
}

.mask {
  position: absolute;
  right: 0;
  bottom: 0px;
  width: 144px;
  height: 144px;

  .mask-bar {
    position: absolute;
    right: 0;
    top: 2px;
    cursor: pointer;
  }
}

.active-icon {
  display: flex;
  position: absolute;
  bottom: 0;
  justify-content: space-between;
  width: 100%;

  .speaker {
    margin-left: 10px;
    cursor: pointer;
  }

  ul {
    li {
      cursor: pointer;
    }
  }
}
</style>
