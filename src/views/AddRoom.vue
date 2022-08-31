<template>
  <div>
    <div class="row">
      <div>
        <h2>Add Room</h2>
        <a @click="$router.go(-1)">(Room List)</a>
      </div>
      <div>
        <form action="">
          <input type="text" id="roomname" v-model.trim="room.roomName" placeholder="Enter Room Name">
          <button type="submit" :disabled="!room.roomName">Save</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>

import firebase from '../Firebase'
import router from '../router'

export default {
  name: 'AddRoom',
  data () {
    return {
      ref: firebase.database().ref('chatrooms/'),
      room: { roomName: '' }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()

      let newData = this.ref.push()
      newData.set({
        roomName: this.room.roomName
      })
      router.go(-1)
        .catch((error) => {
          alert("Error adding document: ", error)
        });
    }
  }
}
</script>
