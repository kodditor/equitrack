package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"strings"

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

type APISingleStockQuoteResponse struct {
	Data  finnhub.Quote `json:"data"`
	Error Error         `json:"error"`
}

type APIStockNewsResponse struct {
	Data  []finnhub.CompanyNews `json:"data"`
	Error Error                 `json:"error"`
}

type APIMarketNewsResponse struct {
	Data  []finnhub.MarketNews `json:"data"`
	Error Error                `json:"error"`
}

type APICompanyDataResponse struct {
	Data  finnhub.BasicFinancials `json:"data"`
	Error Error                   `json:"error"`
}

type APICompanyProfileResponse struct {
	Data  finnhub.CompanyProfile2 `json:"data"`
	Error Error                   `json:"error"`
}

type APIAllSpecifiedStocks struct {
	Data  []finnhub.SymbolLookupInfo `json:"data"`
	Error Error                      `json:"error"`
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
		query, hasQuery := c.GetQuery("q")

		allQueries := strings.Split(query, ",")

		if !hasQuery {
			res := getAllStocks(finnhubClient)
			c.IndentedJSON(http.StatusOK, res)
		} else {
			res := getAllSpecifiedStocks(finnhubClient, allQueries)

			var status int
			if (res.Error != Error{}) {
				status = http.StatusInternalServerError
			} else {
				status = http.StatusOK
			}
			c.IndentedJSON(status, res)
		}
	})

	router.GET("/stocks/:sign", func(c *gin.Context) {
		callSign := c.Param("sign")
		res := getSpecificStock(finnhubClient, callSign)
		var status int
		if (res.Error != Error{}) {
			status = http.StatusInternalServerError
		} else {
			status = http.StatusOK
		}
		c.IndentedJSON(status, res)
	})

	router.GET("/stocks/:sign/quote", func(c *gin.Context) {
		callSign := c.Param("sign")
		res := getSpecificStockQuote(finnhubClient, callSign)
		var status int
		if (res.Error != Error{}) {
			status = http.StatusInternalServerError
		} else {
			status = http.StatusOK
		}
		c.IndentedJSON(status, res)
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

	router.GET("/stocks/:sign/profile", func(c *gin.Context) {
		callSign := c.Param("sign")
		res := getCompanyProfile(finnhubClient, callSign)
		var status int
		if (res.Error != Error{}) {
			status = http.StatusInternalServerError
		} else {
			status = http.StatusOK
		}
		c.IndentedJSON(status, res)
	})

	router.GET("/market-news", func(c *gin.Context) {
		res := getMarketNews(finnhubClient)
		var status int
		if (res.Error != Error{}) {
			status = http.StatusInternalServerError
		} else {
			status = http.StatusOK
		}
		c.IndentedJSON(status, res)
	})

	if exists {
		router.Run("0.0.0.0:8080")
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

func getSpecificStockQuote(finnhub *finnhub.APIClient, callSign string) APISingleStockQuoteResponse {

	res, _, err := finnhub.DefaultApi.Quote(context.Background()).Symbol(callSign).Execute()

	if err != nil {
		return APISingleStockQuoteResponse{Data: res, Error: Error{msg: err.Error(), code: "500"}}
	}

	return APISingleStockQuoteResponse{Data: res, Error: Error{}}
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

func getCompanyProfile(finnhub *finnhub.APIClient, callSign string) APICompanyProfileResponse {
	res, _, err := finnhub.DefaultApi.CompanyProfile2(context.Background()).Symbol(callSign).Execute()

	if err != nil {
		return APICompanyProfileResponse{Data: res, Error: Error{msg: err.Error(), code: "500"}}
	}

	return APICompanyProfileResponse{Data: res, Error: Error{}}
}

func getMarketNews(finnhub *finnhub.APIClient) APIMarketNewsResponse {

	res, _, err := finnhub.DefaultApi.MarketNews(context.Background()).Category("general").Execute()

	if err != nil {
		return APIMarketNewsResponse{Data: res, Error: Error{msg: err.Error(), code: "500"}}
	}

	return APIMarketNewsResponse{Data: res, Error: Error{}}
}

func getAllSpecifiedStocks(finnhub *finnhub.APIClient, queryMap []string) APIAllSpecifiedStocks {

	var allResponses APIAllSpecifiedStocks

	for i := 0; i < len(queryMap); i++ {
		stock, _, err := finnhub.DefaultApi.SymbolSearch(context.Background()).Q(queryMap[i]).Execute()
		if err != nil {
			return APIAllSpecifiedStocks{
				Data:  allResponses.Data,
				Error: Error{msg: "An error occurred while retrieving the stock info", code: "001"}}
		}
		allResponses.Data = append(allResponses.Data, stock.GetResult()[0])

	}
	println(allResponses.Data)

	return allResponses

}
