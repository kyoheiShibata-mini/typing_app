class PlayRecordChannel < ApplicationCable::Channel
  def subscribed
    stream_from "play_record_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end