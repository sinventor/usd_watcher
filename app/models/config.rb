# frozen_string_literal: true

class Config < ApplicationRecord
  validates :name, presence: true
end
