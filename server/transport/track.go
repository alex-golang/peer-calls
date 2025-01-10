package transport

import (
	"github.com/alex-golang/peer-calls/v4/server/identifiers"
)

type Track interface {
	TrackID() identifiers.TrackID
	PeerID() identifiers.PeerID
	Codec() Codec
	SimpleTrack() SimpleTrack
}
