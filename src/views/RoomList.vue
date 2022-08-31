<template>
  <div>
    <div class="row">
      <div>
        <h2>Room list </h2>
        <a href="">(Add Room)</a>
      </div>
      <div>
        <div v-for="room in rooms" :key="room.key" :to="{name: 'Chat', params: {nickname: nickname, roomid: room.key, roomname: room.roomName}}">
          {{room.roomName}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from '../Firebase'

export default {
  name: 'RoomList',
  data () {
    return {
      nickname: this.$route.params.nickname,
      rooms: [],
      errors: [],
      ref: firebase.database().ref('chatrooms/')
    }
  },
  created () {
    this.ref.on('value', (snapshot) => {
      this.rooms = [];
      snapshot.forEach((doc) => {
        let item = doc.val()
        item.key = doc.key
        this.rooms.push(item)
      });
    });
  }
}
</script>

<style>
.table {
  width: 96%;
  margin: 0 auto;
}
</style>
