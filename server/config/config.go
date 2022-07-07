package config

import (
	"log"
	"os"
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
	loadConfig() (Config, error)
}

var loader configLoader = viperConfigLoader{}

func tryEnvironmentVariables() (Config, bool) {
	origin, foundOrigin := os.LookupEnv("SIMULGAMES_ORIGIN")
	secureString, foundSecure := os.LookupEnv("SIMULGAMES_SECURE")
	port, foundPort := os.LookupEnv("SIMULGAMES_PORT")
	found := foundOrigin && foundSecure && foundPort
	return Config{
		origin: origin,
		port:   port,
		secure: secureString == "true",
	}, found
}

func New() Config {
	if config, found := tryEnvironmentVariables(); found {
		return config
	}
	config, err := loader.loadConfig()
	if err != nil {
		log.Panicln(err.Error())
	}
	return config
}
