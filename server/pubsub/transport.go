package pubsub

import (
	"github.com/alex-golang/peer-calls/v5/server/identifiers"
	"github.com/alex-golang/peer-calls/v5/server/transport"
)

// Transport only defines a subset of methods from transport.Transport to make
// mocking in testing easier.
type Transport interface {
	ClientID() identifiers.ClientID

	AddTrack(track transport.Track) (transport.TrackLocal, transport.RTCPReader, error)
	RemoveTrack(trackID identifiers.TrackID) error
}

// Assert that Transport is compatible with the transport.Transport.
var _ Transport = transport.Transport(nil)
