# frozen_string_literal: true

class ExchangeRateExtractorWorker
  include Sidekiq::Worker

  def perform
    ExchangeRateExtractor.new.call
  end
end
