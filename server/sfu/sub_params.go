package sfu

import (
	"github.com/alex-golang/peer-calls/v5/server/identifiers"
)

type SubParams struct {
	// Room to which to subscribe to.
	Room        identifiers.RoomID
	PubClientID identifiers.ClientID
	TrackID     identifiers.TrackID
	SubClientID identifiers.ClientID
}
