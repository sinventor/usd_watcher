# frozen_string_literal: true

module ApiHelpers
  def json
    JSON.parse(response.body).with_indifferent_access
  end

  shared_examples 'responds with error' do |context:|
    it context do
      send(verb, action, params: params, as: :json)
      expect(json[:errors][field]).to include(error)
    end
  end
end
