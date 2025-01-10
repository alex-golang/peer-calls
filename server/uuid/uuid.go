package uuid

import (
	"github.com/google/uuid"
	"github.com/alex-golang/peer-calls/v5/server/basen"
)

var defaultBaseNEncoder = basen.NewBaseNEncoder(basen.AlphabetBase62)

func New() string {
	value := uuid.New()

	return defaultBaseNEncoder.Encode(value[:])
}
