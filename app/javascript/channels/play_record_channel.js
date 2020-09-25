import consumer from "./consumer"

export var keywords = {};
export var user_image = {};

consumer.subscriptions.create("PlayRecordChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    keywords = data.keywords;
    user_image = data.user_image;
  }
});
