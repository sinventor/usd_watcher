# frozen_string_literal: true

FactoryBot.define do
  factory :usd_rate do
    rubles 62.42
    parsed_at { Time.zone.now }

    trait :with_filled_fields do
      filled_rubles 63.37
      filled_rubles_discontinues_at { Time.zone.now + 15.minutes }
    end
  end
end
