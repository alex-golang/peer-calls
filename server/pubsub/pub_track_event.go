package pubsub

import (
	"github.com/alex-golang/peer-calls/v5/server/transport"
)

type PubTrackEvent struct {
	PubTrack PubTrack                 `json:"pubTrack"`
	Type     transport.TrackEventType `json:"type"`
}
