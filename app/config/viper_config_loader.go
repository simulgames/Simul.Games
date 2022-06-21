package config

import (
	"github.com/spf13/viper"
)

type viperConfigLoader struct {
}

func getOrigin() string {
	originPort := viper.GetString("server.ports.ui")
	secure := viper.GetBool("server.secure")
	origin := viper.GetString("server.address")
	if !secure {
		origin += ":" + originPort
	}
	return origin
}

func (v viperConfigLoader) readConfig() (Config, error) {
	viper.AddConfigPath("../")
	err := viper.ReadInConfig()
	if err != nil {
		return Config{}, err
	}
	secure := viper.GetBool("server.secure")
	return Config{
		origin: getOrigin(),
		port:   viper.GetString("server.ports.app"),
		secure: secure,
	}, nil
}
