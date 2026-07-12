'use strict';

const { verifyToken } = require('../utils/tokens');
const { errorResponse } = require('../utils/apiResponse');
const { blacklist } = require('./tokenBlacklist');

/**
 * Advanced auth middleware.
 * Usage: 
 *   auth() -> requires valid token
 *   auth({ optional: true }) -> decodes if present, no error if missing
 *   auth({ roles: ['ADMIN', 'CAPTAIN'] }) -> requires valid token AND specific role
 */
function auth(options = {}) {
  const { optional = false, roles = [] } = options;

  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (optional) return next();
      return res.status(401).json(errorResponse('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];

    if (blacklist.has(token)) {
      if (optional) return next();
      return res.status(401).json(errorResponse('Token has been revoked', 401));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      if (optional) return next();
      return res.status(401).json(errorResponse('Invalid or expired token', 401));
    }

    req.user = decoded;
    req.token = token;

    if (roles.length > 0) {
      // A "captain" isn't a Role enum value in the DB — it's role: STUDENT
      // with isCaptain: true. Routes gated with roles: ['ADMIN', 'CAPTAIN']
      // must accept that flag, not just a literal role match, or real
      // captains get 403'd on every captain-only action.
      const hasDirectRole = roles.includes(req.user.role);
      const hasCaptainFlag = roles.includes('CAPTAIN') && req.user.isCaptain === true;
      if (!hasDirectRole && !hasCaptainFlag) {
        return res.status(403).json(errorResponse(`Requires role: ${roles.join(' or ')}`, 403));
      }
    }

    next();
  };
}

module.exports = auth;
