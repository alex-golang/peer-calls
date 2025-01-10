package logger_test

import (
	"testing"

	"github.com/alex-golang/peer-calls/v5/server/logger"
	"github.com/stretchr/testify/assert"
)

type Ctx = logger.Ctx

func TestCtx(t *testing.T) {
	t.Parallel()

	assert.Equal(t, Ctx(nil), Ctx(nil).WithCtx(nil))
	assert.Equal(t, Ctx{"k": "v"}, Ctx(nil).WithCtx(Ctx{"k": "v"}))
	assert.Equal(t, Ctx{"k": "v"}, Ctx{"k": "v"}.WithCtx(nil))
	assert.Equal(t, Ctx{"k1": "v1", "k2": "v3"}, Ctx{"k1": "v1", "k2": "v2"}.WithCtx(Ctx{"k1": "v1", "k2": "v3"}))
}
