#!/bin/sh

configFile="../config.yaml"
if test -f "$configFile"; then
    address="$(grep -o "address: .*$" "$configFile" | cut -c 10-)"
    if grep -q "secure: true" "$configFile"; then
      fqdn="wss://ws.$address"
      secure="true"
    else
      app_port="$(grep -o "app: .*$" "$configFile" | cut -c 6-)"
      fqdn="ws://$address:$app_port"
      secure="false"
    fi
    ui_port="$(grep -o "ui: .*$" "$configFile" | cut -c 5-)"
    echo "REACT_APP_WEBSOCKET_ADDRESS=$fqdn" > .env
    echo "REACT_APP_IS_SECURE=$secure" >> .env
    echo "PORT=$ui_port" >> .env
else
    echo "make_dotenv.sh: config file not found"
    exit 2
fi