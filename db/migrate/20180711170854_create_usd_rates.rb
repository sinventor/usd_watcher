class CreateUsdRates < ActiveRecord::Migration[5.2]
  def change
    create_table :usd_rates do |t|
      t.decimal :rubles, precision: 19, scale: 2
      t.decimal :filled_rubles, precision: 19, scale: 2
      t.datetime :parsed_at
      t.datetime :filled_rubles_discontinues_at

      t.timestamps
    end
  end
end
