# frozen_string_literal: true

describe ScheduleFilledRublesDiscontinuation do
  subject { described_class.call(usd_rate) }

  let(:usd_rate) { create(:usd_rate, :with_filled_fields) }

  context 'when a schedule does not present yet' do
    it 'creates a new config' do
      expect { subject }.to change {
        Config.exists?(name: described_class::FILLED_RUBLES_DISCONTINUATION_CONFIG_NAME)
      }.from(false).to(true)
    end

    it 'schedules an appropriate task' do
      expect(FilledUsdRateDiscontinueWorker).to receive(:perform_at).with(usd_rate.filled_rubles_discontinues_at).and_call_original
      subject
    end
  end

  context 'when a schedule already exists' do
    before do
      ScheduleFilledRublesDiscontinuation.call(usd_rate)
      usd_rate.update!(filled_rubles_discontinues_at: usd_rate.filled_rubles_discontinues_at + 10.minutes)
    end

    it 'deletes an existing task' do
      expect_any_instance_of(Sidekiq::ScheduledSet).to receive_message_chain(:find_job, :delete)
      subject
    end
  end
end
