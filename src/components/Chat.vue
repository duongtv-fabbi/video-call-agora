<template>
  <div class="chat">
    <div class="header">
      <div class="header-user">
        <div class="avatar">
          <img src="../assets/chat.png" alt="">
        </div>
        <div class="info">
          <div class="nick-name">
            Dương Tiền Hải
          </div>
          <div class="active">Đang hoạt động</div>
        </div>
      </div>
      <div class="social">
        <div class="video-call">
          <img src="" alt="">
        </div>
        <div class="void-call">
          <img src="../assets/icons/cam.svg" alt="">
        </div>
        <div class="profile">
          <img src="" alt="">
        </div>
      </div>
    </div>
    <div class="content">
      <div class="user">
        <div class="user__avatar">
          <img src="../assets/chat.png" alt="">
        </div>
        <div class="message">
          <div class="message__content">
            Hi, how are you same
          </div>
          <div class="message__time">9:40 AM today</div>
        </div>
      </div>
      <div class="user">
        <div class="user__avatar">
          <img src="../assets/chat.png" alt="">
        </div>
        <div class="message">
          <div class="message__content">
            Hi, how are you same
          </div>
          <div class="message__time">9:40 AM today</div>
        </div>
      </div>
      <div class="friend">
        <div class="friend__avatar">
          <img src="../assets/chat.png" alt="">
        </div>
        <div class="message">
          <div class="message__content">
            Hi, how are you same
          </div>
          <div class="message__time">9:40 AM today</div>
        </div>
      </div>
      <div class="user">
        <div class="user__avatar">
          <img src="../assets/chat.png" alt="">
        </div>
        <div class="message">
          <div class="message__content">
            Hi, how are you same
          </div>
          <div class="message__time">9:40 AM today</div>
        </div>
      </div>
      <div class="friend">
        <div class="friend__avatar">
          <img src="../assets/chat.png" alt="">
        </div>
        <div class="message">
          <div class="message__content">
            Hi, how are you same
          </div>
          <div class="message__time">9:40 AM today</div>
        </div>
      </div>
    </div>
    <div class="write">
      <div class="write-content">
        <textarea name="" id="" rows="2" placeholder="abcd" v-model="showMessage"></textarea>
        <div @click="sendMessage" class="send"><img src="../assets/icons/send.svg" alt=""></div>
      </div>
      <div class="icon">
        <img src="../assets/icons/image.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import fire from "../fire";

export default {
  data() {
    return {
      userName: "",
      name: null,
      showMessage: "",
      messages: []
    }
  },
  methods: {
    sendMessage() {
      console.log(1233)
      const message = {
        text: this.showMessage,
        username: this.name
      };
      fire.firestore()
          .collection("messages")
          .doc().set(message);
      this.showMessage = "";
    },
  },
  mounted() {
    let viewMessage = this;
    const itemsRef = fire.database().ref("messages");
    itemsRef.on("value", snapshot => {
      let data = snapshot.val();
      let messages = [];
      Object.keys(data).forEach(key => {
        messages.push({
          id: key,
          username: data[key].username,
          text: data[key].text
        });
      });
      viewMessage.messages = messages;
    });
  }

};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chat {
  max-width: 600px;
  margin: auto;
  border: 1px solid #fff;
  border-radius: 5px;
  background: #e5e5e56e;
  margin-top: 10px;

  .header {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    .header-user {
      display: flex;
    }

    .avatar {
      width: 45px;
      height: 45px;
      margin-right: 10px;

      img {
        width: 100%;
      }
    }

    .info {
      .nick-name {
        font-weight: 600;
      }

      .active {
        font-size: 10px;
      }
    }

    .social {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .content {
    padding: 10px;

    .user {
      display: flex;

      &__avatar {
        width: 30px;
        height: 30px;

        img {
          width: 100%;
          margin-top: 10px;
        }
      }

      .message {
        margin-left: 10px;

        &__content {
          border-radius: 25px;
          background: #82ccdd;
          padding: 10px;
        }

        &__time {
          font-size: 10px;
          padding-left: 10px;
        }
      }
    }

    .friend {
      display: flex;
      justify-content: flex-end;

      &__avatar {
        width: 30px;
        height: 30px;

        img {
          width: 100%;
          margin-top: 10px;
        }
      }

      .message {
        margin-left: 10px;

        &__content {
          border-radius: 25px;
          background: #78e08f;
          padding: 10px;
        }

        &__time {
          font-size: 10px;
          padding-left: 10px;
        }
      }
    }
  }

  .write {
    position: relative;
    padding: 10px;

    .write-content {
      textarea {
        width: 100%;
        border-color: #fff;
        border-radius: 5px;
        padding-left: 5px;
      }

      textarea:focus-visible {
        outline: none;
      }

      .send {
        position: absolute;
        top: 25%;
        right: 25px;
      }
    }
  }
}
</style>
