<template>
  <div class="hello">
    <h2 class="left-align">Agora Video Web SDK Quickstart</h2>
    <div class="row">
      <div>
        <button type="button" id="join" @click="joinAgora">JOIN</button>
        <button type="button" id="leave">LEAVE</button>
      </div>
      <div id="livestream"></div>
    </div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk-ng";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      rtc: {
        localAudioTrack: null,
        localVideoTrack: null,
        client: null,
      },
      options: {
        appId: "87bcd4532cbc4843bf407779d4b1a5a2",
        // Set the channel name.
        channel: "duong_abc",
        // Pass your temp token here.
        token:
          "00687bcd4532cbc4843bf407779d4b1a5a2IAAjbqaOnjl8PhkrqqOUkjQ6g9Pi+pCQ8QWn9MkHvWyt/60lLz4AAAAAEAApikciXk9hYQEAAQBeT2Fh",
        // Set the user ID.
        uid: new Date().getTime().toString(),
      },
    };
  },
  mounted() {
    this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    console.log(this.rtc.client);
    this.rtc.client.on("user-published", this.userPublish);
  },
  methods: {
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
        remotePlayerContainer.textContent =
          "Remote user " + user.uid.toString();
        remotePlayerContainer.style.width = "640px";
        remotePlayerContainer.style.height = "480px";
        document.body.append(remotePlayerContainer);

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
      this.rtc.client.on("user-unpublished", (user) => {
        // Get the dynamically created DIV container.
        const remotePlayerContainer = document.getElementById(user.uid);
        // Destroy the container.
        remotePlayerContainer.remove();
      });
    },
    async joinAgora() {
      // Join an RTC channel.
      await this.rtc.client.join(
        this.options.appId,
        this.options.channel,
        this.options.token,
        this.options.uid
      );
      // Create a local audio track from the audio sampled by a microphone.
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Create a local video track from the video captured by a camera.
      this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      // Publish the local audio and video tracks to the RTC channel.
      await this.rtc.client.publish([
        this.rtc.localAudioTrack,
        this.rtc.localVideoTrack,
      ]);
      // Dynamically create a container in the form of a DIV element for playing the local video track.
      const localPlayerContainer = document.createElement("div");
      // Specify the ID of the DIV container. You can use the uid of the local user.
      localPlayerContainer.id = this.options.uid;
      localPlayerContainer.textContent = "Local user " + this.options.uid;
      localPlayerContainer.style.width = "640px";
      localPlayerContainer.style.height = "480px";
      document.getElementById("livestream").append(localPlayerContainer);

      // Play the local video track.
      // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
      this.rtc.localVideoTrack.play(localPlayerContainer);
      console.log("publish success!");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
