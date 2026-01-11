package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"vpn-service/wireguard"
)

type CreatePeerRequest struct {
	PublicKey  string `json:"public_key" binding:"required"`
	AllowedIPs string `json:"allowed_ips" binding:"required"`
}

func CreatePeer(c *gin.Context, wgMgr *wireguard.WGManager) {
	var req CreatePeerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := wgMgr.AddPeer(req.PublicKey, req.AllowedIPs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Peer added successfully",
	})
}