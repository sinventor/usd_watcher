# frozen_string_literal: true

class UsdRate < ApplicationRecord
  MIN_FILLED_RUBLES = 25.0
  MAX_FILLED_RUBLES = 150.0

  validates :filled_rubles, numericality: { greater_than: MIN_FILLED_RUBLES, less_than: MAX_FILLED_RUBLES }, allow_nil: true
  validate :filled_rubles_discontinues_at_cannot_be_in_the_past, if: :filled_rubles_discontinues_at?

  validate :filled_rubles_is_missing_when_discontinues_at_present, unless: :filled_rubles?

  def self.current
    today_range = Time.zone.now.beginning_of_day..Time.zone.now

    where(parsed_at: today_range).order(parsed_at: :desc).first ||
      where(parsed_at: nil, created_at: today_range).order(created_at: :desc).first
  end

  def filled_rubles_discontinues_at_cannot_be_in_the_past
    return unless filled_rubles_discontinues_at_changed?

    errors.add(:filled_rubles_discontinues_at, :cannot_be_in_the_past) if filled_rubles_discontinues_at < Time.zone.now
  end

  def filled_rubles_is_missing_when_discontinues_at_present
    errors.add(:filled_rubles, :blank_though_discontinues_at_present) if filled_rubles_discontinues_at.present?
  end
end
