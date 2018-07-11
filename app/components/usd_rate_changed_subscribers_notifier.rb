# frozen_string_literal: true

class UsdRateChangedSubscribersNotifier < ApplicationComponent
  attr_reader :serialized_usd_rate

  def initialize(usd_rate)
    @serialized_usd_rate = UsdRateSerializer.new(usd_rate)
  end

  def call
    ActionCable.server.broadcast 'rate_changing', rubles_to_show: serialized_usd_rate.rubles_to_show
  end
end
