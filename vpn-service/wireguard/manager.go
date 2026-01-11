package wireguard

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
)

type WGManager struct {
	interfaceName string
	endpoint      string
	serverPubKey  string
}

func NewWGManager(interfaceName string) *WGManager {
	if interfaceName == "" {
		interfaceName = "wg0"
	}

	endpoint := os.Getenv("WG_ENDPOINT")
	if endpoint == "" {
		endpoint = fmt.Sprintf("%s:%s", os.Getenv("WG_HOSTNAME"), os.Getenv("WG_LISTEN_PORT"))
	}

	serverPubKey := os.Getenv("WG_SERVER_PUBLIC_KEY")
	if serverPubKey == "" {
		log.Fatal("WG_SERVER_PUBLIC_KEY is required")
	}

	return &WGManager{
		interfaceName: interfaceName,
		endpoint:      endpoint,
		serverPubKey:  serverPubKey,
	}
}

// AddPeer добавляет пира по public key и allowed IPs
func (w *WGManager) AddPeer(publicKey, allowedIPs string) error {
	cmd := exec.Command("wg", "set", w.interfaceName,
		"peer", publicKey,
		"allowed-ips", allowedIPs)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to add peer: %w (output: %s)", err, strings.TrimSpace(string(out)))
	}
	return nil
}

// RemovePeer отключает пира (обнуляет endpoint и allowed-ips)
func (w *WGManager) RemovePeer(publicKey string) error {
	cmd := exec.Command("wg", "set", w.interfaceName,
		"peer", publicKey,
		"endpoint", "0.0.0.0:0",
		"allowed-ips", "")
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to disable peer: %w (output: %s)", err, strings.TrimSpace(string(out)))
	}
	return nil
}

// ListPeers возвращает все public keys
func (w *WGManager) ListPeers() ([]string, error) {
	cmd := exec.Command("wg", "show", w.interfaceName, "public-key")
	out, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("failed to list peers: %w", err)
	}

	var peers []string
	scanner := bufio.NewScanner(strings.NewReader(string(out)))
	for scanner.Scan() {
		key := strings.TrimSpace(scanner.Text())
		if key != "" {
			peers = append(peers, key)
		}
	}
	return peers, nil
}

// GetPeerStats возвращает сырые данные по пиру
func (w *WGManager) GetPeerStats(publicKey string) (string, error) {
	cmd := exec.Command("wg", "show", w.interfaceName)
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("wg show failed: %w", err)
	}

	lines := strings.Split(string(out), "\n")
	inTarget := false
	var stats []string

	for _, line := range lines {
		if strings.Contains(line, "peer: "+publicKey) {
			inTarget = true
			continue
		}
		if inTarget && strings.HasPrefix(line, "  ") {
			stats = append(stats, strings.TrimSpace(line))
		} else if inTarget && line != "" && !strings.HasPrefix(line, "  ") {
			break
		}
	}

	if len(stats) == 0 {
		return "", fmt.Errorf("peer not found")
	}
	return strings.Join(stats, "\n"), nil
}

// GetServerInfo возвращает полный вывод wg show
func (w *WGManager) GetServerInfo() (string, error) {
	cmd := exec.Command("wg", "show", w.interfaceName)
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("wg show failed: %w", err)
	}
	return string(out), nil
}

// GenerateClientConfig генерирует конфиг для клиента (вызывается из backend!)
func (w *WGManager) GenerateClientConfig(privateKey, address, publicKey, preSharedKey, allowedIPs string) string {
	configTemplate := `[Interface]
PrivateKey = %s
Address = %s
DNS = 8.8.8.8, 1.1.1.1

[Peer]
PublicKey = %s
PresharedKey = %s
AllowedIPs = %s
Endpoint = %s
PersistentKeepalive = 25`

	return fmt.Sprintf(configTemplate,
		privateKey,
		address,
		w.serverPubKey,
		preSharedKey,
		allowedIPs,
		w.endpoint,
	)
}
