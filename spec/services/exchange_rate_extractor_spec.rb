# frozen_string_literal: true

require 'webmock/rspec'

describe ExchangeRateExtractor do
  subject { described_class.call }

  before do
    stub_request(:get, "#{ExchangeRateExtractor::API_URL}?#{request_query}")
      .to_return(status: 200, body: response_body.to_json, headers: { 'Content-Type': 'application/json' }) # rubocop:disable Metrics/LineLength
  end

  context 'when request fails' do
    let(:request_query) do
      {
        access_key: 'someinvalidapikey',
        currencies: 'RUB'
      }.to_query
    end
    let(:response_body) do
      {
        success: false,
        error: {
          code: 101,
          type: 'invalid_access_key',
          info: 'You have not supplied a valid API Access Key. [Technical Support: support@apilayer.com]' # rubocop:disable Metrics/LineLength
        }
      }
    end

    it 'logs an error' do
      stub_const("#{described_class}::CURRENCY_LAYER_API_KEY", 'someinvalidapikey')

      expect(Rails.logger).to receive(:error).with("#{described_class::FAILED_MESSAGE_HEAD} #{response_body[:error].as_json}")
      subject
    end
  end

  context 'when request succeeds' do
    let(:request_query) do
      {
        access_key: described_class::CURRENCY_LAYER_API_KEY,
        currencies: 'RUB'
      }.to_query
    end
    let(:response_body) do
      {
        success: true,
        quotes: {
          USDRUB: 61.887001
        }
      }
    end
    let(:recorded_rubles) { response_body[:quotes][:USDRUB].round(2) }

    context 'and current usd rate already present' do
      let!(:usd_rate) { create(:usd_rate, rubles: 62.57) }

      it 'not creates new usd rate record' do
        expect { subject }.to_not change(UsdRate, :count)
      end

      it 'updates existing usd rate' do
        expect { subject }.to change { usd_rate.reload.rubles }.from(usd_rate.rubles).to(recorded_rubles)
      end
    end

    context 'and current rate does not present' do
      it 'creates new rate' do
        expect { subject }.to change { UsdRate.count }.by(1)
      end

      it 'records parsed values' do
        subject
        expect(UsdRate.current).to_not be_nil
        expect(UsdRate.current.rubles).to eq(recorded_rubles)
      end
    end
  end
end
