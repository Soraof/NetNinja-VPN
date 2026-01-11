package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"vpn-service/wireguard"
)

type StatsResponse struct {
	PublicKey     string `json:"public_key"`
	RawStats      string `json:"raw_stats"`
}

func GetPeerStats(c *gin.Context, wgMgr *wireguard.WGManager) {
	publicKey := c.Param("publicKey")
	raw, err := wgMgr.GetPeerStats(publicKey)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Peer not found"})
		return
	}
	c.JSON(http.StatusOK, StatsResponse{PublicKey: publicKey, RawStats: raw})
}
