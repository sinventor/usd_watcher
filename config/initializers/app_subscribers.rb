ActiveSupport::Notifications.subscribe('usd_rate.updated') do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)
  UsdRateChangedSubscribersNotifier.call(event.payload[:usd_rate])

  File.open("tmp/#{rand(10000)}.txt", 'w') do |f|
    f.write("Rubles at #{Time.zone.now}: #{event.payload[:usd_rate].rubles}")
  end
end