package handlers

import (
	"fmt"
	"log"
	"net/http"
	"sync"
)

var (
	clients   = make(map[chan string]struct{})
	clientsMu sync.RWMutex
)

func Broadcast(event string) {
	clientsMu.RLock()
	defer clientsMu.RUnlock()

	for ch := range clients {
		select {
		case ch <- event:
		default:
			// drop slow client
		}
	}
}

func SSEHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "streaming unsupported", http.StatusInternalServerError)
		return
	}

	ch := make(chan string, 10)
	clientsMu.Lock()
	clients[ch] = struct{}{}
	clientsMu.Unlock()

	defer func() {
		clientsMu.Lock()
		delete(clients, ch)
		clientsMu.Unlock()
	}()

	ctx := r.Context()
	for {
		select {
		case <-ctx.Done():
			log.Println("sse client disconnected")
			return
		case event := <-ch:
			fmt.Fprintf(w, "event: %s\ndata: {}\n\n", event)
			flusher.Flush()
		}
	}
}
