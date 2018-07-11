# frozen_string_literal: true

describe Api::UsdRateController do
  describe 'GET current' do
    let!(:usd_rate) { create(:usd_rate) }

    it 'respond with ok' do
      get :current

      expect(response).to be_ok
      expect(json[:rubles]).to eq(usd_rate.rubles)
    end
  end

  describe 'PUT refresh' do
    context 'when params are valid' do
      before do
        put :refresh, params: { usd_rate: usd_rate_params }, as: :json
      end

      let(:usd_rate_params) do
        {
          filled_rubles: 46.23,
          filled_rubles_discontinues_at: Time.zone.now + 15.minutes
        }
      end

      it 'responds with ok' do
        expect(response).to be_ok
      end

      it 'updates fields for current rate' do
        expect(UsdRate.current.filled_rubles).to eq(usd_rate_params[:filled_rubles])
      end
    end

    context 'when any param is invalid' do
      let(:usd_rate_attrs_i18n_scope) { 'activerecord.errors.models.usd_rate.attributes' }
      let(:verb) { :put }
      let(:action) { :refresh }

      describe '(filled_rubles)' do
        let(:field) { :filled_rubles }
        let(:params) do
          { filled_rubles: filled_rubles }
        end

        it_behaves_like 'responds with error', context: :too_little do
          let(:error) { I18n.t('.filled_rubles.greater_than', scope: usd_rate_attrs_i18n_scope, count: UsdRate::MIN_FILLED_RUBLES) }
          let(:filled_rubles) { 6.23 }
        end

        it_behaves_like 'responds with error', context: :too_much do
          let(:error) { I18n.t('.filled_rubles.less_than', scope: usd_rate_attrs_i18n_scope, count: UsdRate::MAX_FILLED_RUBLES) }
          let(:filled_rubles) { 206.29 }
        end
      end

      describe '(filled_rubles_discontinues_at)' do
        let(:field) { :filled_rubles_discontinues_at }
        let(:params) do
          { filled_rubles_discontinues_at: Time.zone.now - 2.weeks }
        end

        it_behaves_like 'responds with error', context: :cannot_be_in_the_past do
          let(:error) { I18n.t('.filled_rubles_discontinues_at.cannot_be_in_the_past', scope: usd_rate_attrs_i18n_scope) }
        end
      end
    end
  end
end
