package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"vpn-service/wireguard"
)

type ServerInfoResponse struct {
	RawOutput string `json:"raw_wg_show_output"`
}

func GetServerInfo(c *gin.Context, wgMgr *wireguard.WGManager) {
	raw, err := wgMgr.GetServerInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, ServerInfoResponse{RawOutput: raw})
}
//Sora