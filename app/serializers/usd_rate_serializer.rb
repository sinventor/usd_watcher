# frozen_string_literal: true

class UsdRateSerializer < ActiveModel::Serializer
  attributes :id, :rubles, :filled_rubles, :filled_rubles_discontinues_at, :rubles_to_show

  def rubles_to_show
    return object.filled_rubles if filled_fields_present? && object.filled_rubles_discontinues_at >= Time.zone.now

    object.rubles
  end

  private

  def filled_fields_present?
    object.filled_rubles.present? && object.filled_rubles_discontinues_at.present?
  end
end
