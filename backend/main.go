package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	finnhub "github.com/Finnhub-Stock-API/finnhub-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Error struct {
	msg  string
	code string
}

type APIAllStocksResponse struct {
	Data  []finnhub.StockSymbol `json:"data"`
	Error Error                 `json:"error"`
}

type APISingleStockResponse struct {
	Data  finnhub.SymbolLookup `json:"data"`
	Error Error                `json:"error"`
}

type APIStockNewsResponse struct {
	Data  []finnhub.CompanyNews `json:"data"`
	Error Error                 `json:"error"`
}

type APICompanyDataResponse struct {
	Data  finnhub.BasicFinancials `json:"data"`
	Error Error                   `json:"error"`
}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
}

func main() {

	finnhubKey, exists := os.LookupEnv("FINNHUB_API_KEY")

	cfg := finnhub.NewConfiguration()
	cfg.AddDefaultHeader("X-Finnhub-Token", finnhubKey)
	finnhubClient := finnhub.NewAPIClient(cfg)

	router := gin.Default()
	router.Use(CORSMiddleware())

	router.GET("/stocks", func(c *gin.Context) {
		res := getAllStocks(finnhubClient)
		c.IndentedJSON(http.StatusOK, res)
	})

	router.GET("/stocks/:sign", func(c *gin.Context) {
		callSign := c.Param("sign")
		res := getSpecificStock(finnhubClient, callSign)
		c.IndentedJSON(http.StatusOK, res)
	})

	router.GET("/stocks/:sign/news", func(c *gin.Context) {
		callSign := c.Param("sign")
		res := getStockNews(finnhubClient, callSign)
		var status int
		if (res.Error != Error{}) {
			status = http.StatusInternalServerError
		} else {
			status = http.StatusOK
		}
		c.IndentedJSON(status, res)
	})

	router.GET("/stocks/:sign/data", func(c *gin.Context) {
		callSign := c.Param("sign")
		res := getCompanyData(finnhubClient, callSign)
		var status int
		if (res.Error != Error{}) {
			status = http.StatusInternalServerError
		} else {
			status = http.StatusOK
		}
		c.IndentedJSON(status, res)
	})

	if exists {
		router.Run("localhost:8080")
	} else {
		println("Finnhub API Key does not exist.")
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func getAllStocks(finnhub *finnhub.APIClient) APIAllStocksResponse {

	res, _, err := finnhub.DefaultApi.StockSymbols(context.Background()).Mic("XNAS").SecurityType("Common Stock").Exchange("US").Execute()

	if err != nil {
		return APIAllStocksResponse{Data: res, Error: Error{msg: err.Error(), code: "500"}}
	}

	return APIAllStocksResponse{Data: res, Error: Error{}}
}

func getSpecificStock(finnhub *finnhub.APIClient, callSign string) APISingleStockResponse {

	res, _, err := finnhub.DefaultApi.SymbolSearch(context.Background()).Q(callSign).Execute()

	if err != nil {
		return APISingleStockResponse{Data: res, Error: Error{msg: err.Error(), code: "500"}}
	}

	return APISingleStockResponse{Data: res, Error: Error{}}

}

func getStockNews(finnhub *finnhub.APIClient, callSign string) APIStockNewsResponse {

	currentTime := time.Now()
	currentDate := currentTime.Format("2006-01-02")

	res, _, err := finnhub.DefaultApi.CompanyNews(context.Background()).From("2024-01-01").To(currentDate).Symbol(callSign).Execute()

	if err != nil {
		return APIStockNewsResponse{Data: res, Error: Error{msg: err.Error(), code: "500"}}
	}

	return APIStockNewsResponse{Data: res, Error: Error{}}
}

func getCompanyData(finnhub *finnhub.APIClient, callSign string) APICompanyDataResponse {
	res, _, err := finnhub.DefaultApi.CompanyBasicFinancials(context.Background()).Symbol(callSign).Metric("all").Execute()

	if err != nil {
		return APICompanyDataResponse{Data: res, Error: Error{msg: err.Error(), code: "500"}}
	}

	return APICompanyDataResponse{Data: res, Error: Error{}}
}
