package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"vpn-service/handlers"
	"vpn-service/wireguard"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}

	wgManager := wireguard.NewWGManager(os.Getenv("WG_INTERFACE"))

	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := r.Group("/api")
	{
		// ✅ Работает: создаёт пира через wg CLI
		api.POST("/peer", func(c *gin.Context) {
			handlers.CreatePeer(c, wgManager)
		})

		// ❌ Пока НЕ нужен в Go-сервисе — данные о пире отдаёт backend из БД
		// api.GET("/peer/:publicKey", func(c *gin.Context) {
		// 	c.JSON(http.StatusNotImplemented, gin.H{
		// 		"error": "Peer details are served by the main backend API",
		// 	})
		// })

		// ❌ Обновление пира — тоже управляется через backend + повторный вызов /peer
		// api.PUT("/peer/:publicKey", func(c *gin.Context) {
		// 	c.JSON(http.StatusNotImplemented, gin.H{
		// 		"error": "Peer updates are handled via the main backend",
		// 	})
		// })

		// ✅ Работает: отключает пира (обнуляет allowed-ips)
		api.DELETE("/peer/:publicKey", func(c *gin.Context) {
			handlers.DisablePeer(c, wgManager)
		})

		// ✅ Работает: возвращает сырую статистику от `wg show`
		api.GET("/peer/:publicKey/stats", func(c *gin.Context) {
			handlers.GetPeerStats(c, wgManager)
		})

		// ✅ Работает: возвращает `wg show` для всего интерфейса
		api.GET("/server/info", func(c *gin.Context) {
			handlers.GetServerInfo(c, wgManager)
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("VPN Service starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
//Sora