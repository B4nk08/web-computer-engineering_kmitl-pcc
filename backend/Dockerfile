# syntax=docker/dockerfile:1
FROM golang:1.23-bookworm AS builder
WORKDIR /app

ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOPROXY=https://proxy.golang.org,direct

COPY go.mod ./
COPY go.sum* ./
COPY . .
RUN go mod tidy && go build -o /server ./cmd/server

FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=builder /server /app/server
EXPOSE 8080
CMD ["/app/server"]
