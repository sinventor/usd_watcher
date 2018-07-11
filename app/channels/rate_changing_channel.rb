# frozen_string_literal: true

class RateChangingChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'rate_changing'
  end
end
