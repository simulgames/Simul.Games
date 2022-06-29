#!/bin/sh

if [ "$IGNORE_CONFIG" =  "1" ]; then
  # for if we have already set up environment variables from another source, e.g. cloudflare pages
  echo "make_dotenv.sh: skipped - override set"
  exit 0
fi
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
    echo "VITE_WEBSOCKET_ADDRESS=$fqdn" > .env
    echo "VITE_IS_SECURE=$secure" >> .env
    echo "PORT=$ui_port" >> .env
    echo "make_dotenv.sh: success"
else
    echo "make_dotenv.sh: error - config file not found"
    exit 2
fi