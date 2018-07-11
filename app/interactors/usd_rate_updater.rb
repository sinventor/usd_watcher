# frozen_string_literal: true

class UsdRateUpdater
  include Interactor

  TRACKABLE_FIELDS = %i[
    rubles
    filled_rubles
    filled_rubles_discontinues_at
  ].freeze
  UPDATABLE_FIELDS = TRACKABLE_FIELDS

  delegate :new_params, :usd_rate, to: :context

  def call
    return if provided_params.blank? || updatable_params.blank?

    update!
    notify_subscribers
    reschedule_filled_rubles_discontinuation_if_needed

    context.usd_rate = usd_rate
  end

  def update!
    context.fail!(errors: usd_rate.errors) unless usd_rate.update(updatable_params)
  end

  def notify_subscribers
    UsdRateChangedSubscribersNotifier.call(usd_rate) if any_previous_changes?
  end

  def reschedule_filled_rubles_discontinuation_if_needed
    return unless updatable_params.key?(:filled_rubles_discontinues_at)

    ScheduleFilledRublesDiscontinuation.call(usd_rate)
  end

  def updatable_params
    @updatable_params ||= provided_params.reject do |k, v|
      usd_rate.public_send(k) == v
    end
  end

  def provided_params
    @provided_params ||= new_params.slice(*UPDATABLE_FIELDS)
  end

  def any_previous_changes?
    usd_rate.previous_changes.slice(*TRACKABLE_FIELDS).any?
  end
end
