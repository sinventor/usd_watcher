# frozen_string_literal: true

module Api
  class UsdRateController < ApiController
    before_action :set_usd_rate

    def current
      render json: @usd_rate
    end

    def refresh
      updater = UsdRateUpdater.call(usd_rate: @usd_rate, new_params: usd_rate_params.to_h)

      if updater.success?
        render json: updater.usd_rate
      else
        render json: { errors: updater.errors }, status: :unprocessable_entity
      end
    end

    private

    def set_usd_rate
      @usd_rate = UsdRate.current || UsdRate.create!
    end

    def usd_rate_params
      params.require(:usd_rate).permit(:filled_rubles, :filled_rubles_discontinues_at)
    end
  end
end
