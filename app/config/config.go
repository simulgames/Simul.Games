package config

import (
	"log"
)

type Config struct {
	origin string
	port   string
	secure bool
}

func (c Config) IsSecure() bool {
	return c.secure
}

//goland:noinspection HttpUrlsUsage
func (c Config) getProtocol() string {
	if c.IsSecure() {
		return "https://"
	}
	return "http://"
}

func (c Config) GetOrigin() string {
	FQDN := c.getProtocol() + c.origin
	return FQDN
}

func (c Config) GetPort() string {
	return ":" + c.port
}

type configLoader interface {
	readConfig() (Config, error)
}

var loader configLoader = viperConfigLoader{}

func New() Config {
	config, err := loader.readConfig()
	if err != nil {
		log.Panicln(err.Error())
	}
	return config
}
