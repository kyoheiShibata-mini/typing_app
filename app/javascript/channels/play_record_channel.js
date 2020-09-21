import consumer from "./consumer"

export var keywords = {};

consumer.subscriptions.create("PlayRecordChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    keywords = data.keywords;
  }
});
