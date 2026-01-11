package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"vpn-service/wireguard"
)

func DisablePeer(c *gin.Context, wgMgr *wireguard.WGManager) {
	publicKey := c.Param("publicKey")
	if err := wgMgr.RemovePeer(publicKey); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Peer disabled"})
}