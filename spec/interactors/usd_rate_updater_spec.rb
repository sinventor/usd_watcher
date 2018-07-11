# frozen_string_literal: true

describe UsdRateUpdater do
  subject { described_class.call(usd_rate: usd_rate, new_params: new_params) }

  let(:usd_rate) { create(:usd_rate, rubles: 64.23) }

  context 'when new params are not valid' do
    let(:new_params) do
      {
        filled_rubles: 5.19
      }
    end

    it 'fails' do
      expect(subject).to be_a_failure
    end

    it 'returns an appropriate errors' do
      expect(subject.errors.details).to include(:filled_rubles)
      expect(subject.errors.details[:filled_rubles]).to include(include(error: :greater_than))
    end
  end

  context 'when new params is present and valid' do
    let(:new_params) do
      {
        rubles: 65.19
      }
    end

    it 'updates new provided values' do
      expect(subject).to be_a_success
      expect(usd_rate.reload.rubles).to eq(new_params[:rubles])
    end

    it 'notifies subscribers' do
      expect(UsdRateChangedSubscribersNotifier).to receive(:call).with(usd_rate.reload)
      subject
    end
  end

  context 'when filled_rubles_discontinues_at had changed' do
    let(:new_params) do
      {
        filled_rubles: 66.23,
        filled_rubles_discontinues_at: Time.zone.now + 20.minutes
      }
    end

    it 'schedules filled rubles discuntinuation' do
      expect(ScheduleFilledRublesDiscontinuation).to receive(:call).with(usd_rate)
      subject
    end
  end
end
