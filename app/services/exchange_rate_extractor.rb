# frozen_string_literal: true

class ExchangeRateExtractor < ApplicationService
  CURRENCY_LAYER_API_KEY = Rails.application.credentials.dig(:currency_layer, :api_key)
  CURRENCY_LAYER_BASE_URI = 'http://www.apilayer.net/api'
  API_URL = "#{CURRENCY_LAYER_BASE_URI}/live"
  FAILED_MESSAGE_HEAD = "A request to api service (#{API_URL}) failed:"

  def call
    if response_success?
      create_or_update_today_usd_rate
    else
      Rails.logger.error "#{FAILED_MESSAGE_HEAD} #{response_data[:error]}"
    end
  end

  private

  def response
    @response ||= HTTParty.get(API_URL, request_query)
  end

  def response_success?
    response_data[:success]
  end

  def response_data
    response.with_indifferent_access
  end

  def request_query
    {
      query: {
        access_key: CURRENCY_LAYER_API_KEY,
        currencies: 'RUB'
      }
    }
  end

  def create_or_update_today_usd_rate
    usd_rate = UsdRate.current
    rubles_in_usd = response_data[:quotes][:USDRUB]
    parsed_at = Time.zone.now

    if usd_rate.present?
      usd_rate.update!(rubles: rubles_in_usd, parsed_at: parsed_at)
    else
      UsdRate.create!(rubles: rubles_in_usd, parsed_at: parsed_at)
    end
  end
end
