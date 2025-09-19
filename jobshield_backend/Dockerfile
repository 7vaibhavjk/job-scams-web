FROM golang:1.24-bullseye
RUN apt-get update && apt-get install -y gcc
WORKDIR /app
COPY . .
RUN go build -o anti_scam ./cmd
ENV GIN_MODE=release
EXPOSE 8003
CMD ["./anti_scam"]
