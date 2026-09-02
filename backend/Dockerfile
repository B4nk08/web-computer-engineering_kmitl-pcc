# syntax=docker/dockerfile:1
FROM golang:1.24-alpine AS builder
WORKDIR /app

ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOPROXY=https://proxy.golang.org,direct

RUN apk add --no-cache git ca-certificates

COPY go.mod ./
COPY go.sum* ./
COPY . .
RUN go mod tidy && go build -o /server ./cmd/server

FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=builder /server /app/server
EXPOSE 8080
CMD ["/app/server"]
