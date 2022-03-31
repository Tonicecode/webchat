<template>
  <div class="hello">
    <div class="lechat" v-if="show">乐聊</div>
    <div id="loginbox">
      <div style="width: 260px; margin: 100px auto 200px">
        <h3>请先输入你在聊天室的昵称</h3>
        <br />
        <br />

        <input
          type="text"
          style="
            width: 180px;
            border: 1px solid white;
            height: 30px;
            text-align: center;
          "
          maxlength="10"
          placeholder="请输入靓仔名称"
          id="username"
          name="username"
          v-model="username"
          @keydown="getUp()"
        />
        <input
          type="text"
          style="
            width: 180px;
            border: 1px solid white;
            height: 30px;
            text-align: center;
            margin-top: 30px;
          "
          placeholder="请输入内测码"
          id="tCode"
          name="tCode"
          v-model="testCode"
          @keydown="getUp()"
        />
        <div>
          <input
            type="button"
            class="sub-tj"
            value="提交"
            @click="usernameSubmit()"
          />
        </div>
      </div>
    </div>
    <div id="chatbox" style="display: none; padding-top: 32px">
      <div
        style="
          height: 32px;
          width: 100%;
          font-size: 12px;
          position: fixed;
          z-index: 99;
          top: 0;
          background: #2fd086;
        "
      >
        <div
          style="
            line-height: 32px;
            color: #fff;
            display: flex;
            justify-content: space-around;
            padding: 0 2px;
          "
        >
          <span>在线：{{ onlineCount }}人</span>
          <span
            style="
              text-align: left;
              margin-left: 10px;
              flex: 1;
              text-align: center;
            "
            >Websocket多人聊天室</span
          >
          <span style="float: right; margin-right: 10px">
            <span id="showusername">{{ welcome }}</span> |
            <a href="javascript:;" @click="logout()" style="color: #fff"
              >退出</a
            ></span
          >
        </div>
      </div>
      <div id="doc">
        <div id="chat">
          <div id="message" class="message">
            <div
              id="onlinecount"
              style="
                background: #efeff4;
                font-size: 12px;
                margin-top: 10px;
                margin-left: 10px;
                color: #666;
              "
            >
              当前共有{{ onlineCount }}人在线，在线列表：{{ userhtml }}
            </div>
          </div>
          <div class="input-box">
            <div class="input">
              <input
                type="text"
                maxlength="140"
                placeholder="禁止任何非法言论！"
                name="content"
                v-model="content"
                @keydown="sendMas()"
              />
            </div>
            <div class="action">
              <button type="button" id="mjr_send" @click="submit()">
                提交
              </button>
            </div>

            <div
              style="
                font-size: 12px;
                float: left;
                position: absolute;
                width: 100%;
                top: 45px;
                left: 10px;
              "
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://server.mygood.top");

export default {
  name: "HelloWorld",
  data() {
    return {
      userid: "",
      username: "",
      content: "",
      onlineUsers: {}, //用户列表
      onlineCount: 0, //当前在线人数
      userhtml: "", //更新在线人数
      user: "", //新加入用户的信息
      welcome: "",
      show: true,
      testCode: "",
    };
  },
  mounted() {
    this.$socket.emit("hello", this.username); //触发socket连接
    //监听消息发送
    socket.on("message", (obj) => {
      let uid = obj.userid;
      let type = typeof obj.userid;
      if (type == "object") {
        uid = uid.userid;
      }
      let isme = uid == this.userid ? true : false;
      // console.log(uid, this.userid, obj);
      let contentDiv = "<div>" + obj.content + "</div>";
      let usernameDiv = "<span>" + obj.username + "</span>";

      let section = document.createElement("section");
      if (isme) {
        section.className = "user";
        section.innerHTML = contentDiv + usernameDiv;
      } else {
        section.className = "service";
        section.innerHTML = usernameDiv + contentDiv;
      }
      document.getElementById("message").appendChild(section);
      this.scrollToBottom();
    });
    //监听新用户登录
    socket.on("login", (o) => {
      this.updateSysMsg(o, "login");
    });

    //监听用户退出
    socket.on("logout", (o) => {
      this.updateSysMsg(o, "logout");
    });
  },

  methods: {
    //用户登录
    getUp(e) {
      e = e || event;
      if (e.keyCode === 13) {
        this.usernameSubmit();
      }
    },

    //通过“回车”提交信息
    sendMas(e) {
      e = e || event;
      if (e.keyCode === 13) {
        this.submit();
      }
    },

    //提交聊天消息内容
    submit() {
      if (this.content != "") {
        let obj = {
          userid: this.userid,
          username: this.username,
          content: this.content,
        };
        socket.emit("message", obj);
      }
      this.content = "";
      return false;
    },

    //更新系统消息，本例中在用户加入、退出的时候调用
    updateSysMsg(o, action) {
      //当前在线用户列表
      this.onlineUsers = o.onlineUsers;
      //当前在线人数
      this.onlineCount = o.onlineCount;
      //新加入用户的信息
      this.user = o.user;
      let separator = "";
      for (let key in this.onlineUsers) {
        if (this.onlineUsers.hasOwnProperty[key]) {
          this.userhtml += separator + this.onlineUsers[key];
          separator = "、";
        }
      }
      //添加系统消息
      let html = "";
      html += '<div class="msg-system">';
      html += this.user.username;
      html += action == "login" ? " 加入了聊天室" : " 退出了聊天室";
      html += "</div>";
      let section = document.createElement("section");
      section.className = "system J-mjrlinkWrap J-cutMsg";
      section.innerHTML = html;
      document.getElementById("message").appendChild(section);
      this.scrollToBottom();
    },

    //第一个界面用户提交用户名
    async usernameSubmit() {
      let paw = await this.$http.post(`/login`, { });
      let test  = paw.data
      if (this.username != "" && this.testCode != "") {
        if (this.testCode != test) {
          alert("内测码不正确");
          return;
        }
        document.getElementById("loginbox").style.display = "none";
        document.getElementById("chatbox").style.display = "block";
        this.show = false;
        this.init();
      }
      return false;
    },
    init() {
      /*
			客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
			实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
			*/
      this.userid = this.genUid();

      this.welcome = this.username;
      //this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + "px";
      this.scrollToBottom();

      //告诉服务器端有用户登录
      socket.emit("login", { userid: this.userid, username: this.username });
    },

    //随机生成id
    genUid: function () {
      return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    },

    //让浏览器滚动条保持在最低部
    scrollToBottom: function () {
      window.scrollTo(0, document.getElementById("message").clientHeight);
    },
    //退出，本例只是一个简单的刷新
    logout: function () {
      // socket.emit("disconnect", {});
      location.reload();
    },
  },
  created() {
    //一定要移除旧的message监听，否则会出现重复监听的状况
    socket.removeListener("message");
    //这是移除所有监听
    // socket.removeAllListeners();
    // socket.on("message", (data) => {
    //   console.log(data);
    // });
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url(../style/socket.css);
</style>
