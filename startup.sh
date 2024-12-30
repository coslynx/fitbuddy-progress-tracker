#!/bin/bash
set -euo pipefail

PROJECT_ROOT=$(pwd)
LOG_FILE="$PROJECT_ROOT/startup.log"
PID_FILE="$PROJECT_ROOT/app.pid"
NODE_MODULES="$PROJECT_ROOT/node_modules"
API_BASE_URL=""
AUTH_API_URL=""
MONGODB_URI=""

log_info() {
  date +"%Y-%m-%d %H:%M:%S - $1" | tee -a "$LOG_FILE"
}

log_error() {
  date +"%Y-%m-%d %H:%M:%S - ERROR: $1" | tee -a "$LOG_FILE" >&2
}

cleanup() {
  log_info "Cleaning up..."
  if [ -f "$PID_FILE" ]; then
    kill $(cat "$PID_FILE") 2>/dev/null
    rm -f "$PID_FILE"
  fi
  log_info "Cleanup complete."
}

check_dependencies() {
  if ! command -v npm &> /dev/null; then
    log_error "npm is not installed. Please install Node.js and npm."
    exit 1
  fi
    if ! command -v git &> /dev/null; then
        log_error "git is not installed. Please install git."
        exit 1
    fi
  log_info "Dependencies check passed."
}

check_port() {
  local port="$1"
  if lsof -Pi :"$port" -sTCP:LISTEN -t > /dev/null; then
    log_error "Port $port is already in use."
    return 1
  fi
    log_info "Port $port is available."
  return 0
}

wait_for_service() {
  local port="$1"
  local timeout="$2"
  local start_time=$(date +%s)
  while true; do
      if check_port "$port"; then
          break
      fi
    local elapsed_time=$(( $(date +%s) - start_time ))
    if [ "$elapsed_time" -ge "$timeout" ]; then
      log_error "Timeout waiting for port $port."
      return 1
    fi
    sleep 1
  done
  log_info "Service is available on port $port."
  return 0
}

store_pid() {
    local pid="$1"
    echo "$pid" > "$PID_FILE"
    log_info "Process ID $pid stored in $PID_FILE"
}

start_frontend() {
  log_info "Starting frontend..."
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        if [ -d "$NODE_MODULES" ]; then
          if find "$NODE_MODULES" -maxdepth 0 -empty -print -quit | grep -q .; then
              log_info "Existing node_modules directory is empty, no backup needed"
            else
                log_info "Backing up existing node_modules directory."
              mv "$NODE_MODULES" "$NODE_MODULES"_backup_$(date +%Y%m%d%H%M%S)
            fi
        fi
        log_info "Installing npm dependencies..."
        npm install || { log_error "npm install failed."; exit 1; }
         if [ -n "$VITE_API_BASE_URL" ]; then
           export VITE_API_BASE_URL
           log_info "VITE_API_BASE_URL set to: $VITE_API_BASE_URL"
        else
          log_error "VITE_API_BASE_URL is not set in .env or environment."
          exit 1
        fi
         if [ -n "$VITE_AUTH_API_URL" ]; then
           export VITE_AUTH_API_URL
           log_info "VITE_AUTH_API_URL set to: $VITE_AUTH_API_URL"
        else
            log_error "VITE_AUTH_API_URL is not set in .env or environment."
             exit 1
          fi
        if [ -n "$VITE_MONGODB_URI" ]; then
            export VITE_MONGODB_URI
            log_info "VITE_MONGODB_URI set to: $VITE_MONGODB_URI"
          else
            log_error "VITE_MONGODB_URI is not set in .env or environment."
            exit 1
        fi

        npm run dev &
        FRONTEND_PID=$!
        store_pid "$FRONTEND_PID"
        log_info "Frontend started with PID: $FRONTEND_PID"
      else
        log_error "package.json not found. Frontend start failed."
         exit 1
    fi
}

load_env() {
    if [ -f "$PROJECT_ROOT/.env" ]; then
        log_info "Loading environment variables from .env"
        set -o allexport
        source "$PROJECT_ROOT/.env"
        set +o allexport
        API_BASE_URL="$VITE_API_BASE_URL"
        AUTH_API_URL="$VITE_AUTH_API_URL"
        MONGODB_URI="$VITE_MONGODB_URI"
    else
        log_info ".env file not found, using system environment variables."
    fi
      if [ -z "$VITE_API_BASE_URL" ]; then
        log_error "VITE_API_BASE_URL not set in .env file"
        exit 1
    fi
      if [ -z "$VITE_AUTH_API_URL" ]; then
        log_error "VITE_AUTH_API_URL not set in .env file"
        exit 1
    fi
    if [ -z "$VITE_MONGODB_URI" ]; then
      log_error "VITE_MONGODB_URI not set in .env file"
      exit 1
  fi
}

trap cleanup EXIT ERR INT TERM

load_env

check_dependencies

start_frontend

wait_for_service 5173 30

log_info "Application started successfully."
tail -f "$LOG_FILE"