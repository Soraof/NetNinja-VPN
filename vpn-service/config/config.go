package config

import (
	"os"
	"strconv"
)

type Config struct {
	WireGuardInterface string
	ServerPublicKey    string
	ServerPrivateKey   string
	ListenPort         int
	Endpoint           string
	AllowedIPs         string
	PersistentKeepalive int
}

func LoadConfig() *Config {
	port, _ := strconv.Atoi(os.Getenv("WG_LISTEN_PORT"))
	if port == 0 {
		port = 51820
	}
	
	keepalive, _ := strconv.Atoi(os.Getenv("WG_PERSISTENT_KEEPALIVE"))
	if keepalive == 0 {
		keepalive = 25
	}
	
	return &Config{
		WireGuardInterface: os.Getenv("WG_INTERFACE"),
		ServerPublicKey:    os.Getenv("WG_SERVER_PUBLIC_KEY"),
		ServerPrivateKey:   os.Getenv("WG_SERVER_PRIVATE_KEY"),
		ListenPort:         port,
		Endpoint:           os.Getenv("WG_ENDPOINT"),
		AllowedIPs:         os.Getenv("WG_ALLOWED_IPS"),
		PersistentKeepalive: keepalive,
	}
}
