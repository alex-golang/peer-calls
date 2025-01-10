package transport

import "github.com/alex-golang/peer-calls/v5/server/identifiers"

type TrackJSON struct {
	TrackID identifiers.TrackID `json:"id"`
	PeerID  identifiers.PeerID  `json:"peerId"`
	Codec   Codec               `json:"codec"`
}
