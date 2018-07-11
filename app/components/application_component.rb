# frozen_string_literal: true

class ApplicationComponent
  class << self
    def call(*args)
      new(*args).call
    end
  end
end
