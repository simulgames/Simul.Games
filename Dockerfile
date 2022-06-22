FROM golang:alpine AS builder
WORKDIR /simulgames
COPY dictionary dictionary
WORKDIR /simulgames/app
COPY app .
RUN go build

FROM alpine:latest
COPY --from=builder /simulgames /
WORKDIR app
CMD ["./simul-app"]

# relies on environment variables to be set as does not use config.yaml -- example deployment below:
# docker build -t simulgames .
# docker run --rm -it -e "SIMULGAMES_ORIGIN=localhost" -e "SIMULGAMES_SECURE=false" -e "SIMULGAMES_PORT=8080" -p "8080:8080" simulgames
