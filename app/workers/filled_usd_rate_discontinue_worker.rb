# frozen_string_literal: true

class FilledUsdRateDiscontinueWorker
  include Sidekiq::Worker

  def perform
    usd_rate = UsdRate.current

    return if usd_rate.nil?

    UsdRateChangedSubscribersNotifier.call(usd_rate)
  end
end
