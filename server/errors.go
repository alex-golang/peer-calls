package server

import (
	pkgErrors "errors"

	"github.com/juju/errors"
	"github.com/alex-golang/peer-calls/v4/server/multierr"
)

type MultiErrorHandler = multierr.MultiErr

func errIs(err error, target error) bool {
	return pkgErrors.Is(errors.Cause(err), target)
}
