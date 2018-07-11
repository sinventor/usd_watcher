# frozen_string_literal: true

class ScheduleFilledRublesDiscontinuation < ApplicationComponent
  FILLED_RUBLES_DISCONTINUATION_CONFIG_NAME = 'filled_rubles_discontinuation_job_id'

  attr_reader :new_discontinues_at, :usd_rate

  def initialize(usd_rate)
    @usd_rate = usd_rate
    @new_discontinues_at = usd_rate.filled_rubles_discontinues_at
  end

  def call
    remove_previous_schedule_if_present

    return if new_discontinues_at.nil?

    new_jid = FilledUsdRateDiscontinueWorker.perform_at(new_discontinues_at)
    Config.find_or_initialize_by(name: FILLED_RUBLES_DISCONTINUATION_CONFIG_NAME).update!(value: new_jid)
  end

  private

  def filled_rubles_discontinuation_config
    return @filled_rubles_discontinuation_config if defined?(@filled_rubles_discontinuation_config)
    @filled_rubles_discontinuation_config = Config.find_by(name: FILLED_RUBLES_DISCONTINUATION_CONFIG_NAME)
  end

  def remove_previous_schedule_if_present
    return if filled_rubles_discontinuation_config.blank?

    Sidekiq::ScheduledSet.new.find_job(filled_rubles_discontinuation_config.value)&.delete
  end
end
