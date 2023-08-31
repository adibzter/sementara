const ip = require('ip');
/**
 * Get client's public IP address
 *
 * @param {IncomingMessage} req - Request from the client
 * @return {string} Public IP address
 *
 * @example
 *
 *     getPublicIpAddress(req)
 */
const getPublicIpAddress = (req) => {
  const remoteAddress =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let publicIpAddress = remoteAddress;

  if (!publicIpAddress) {
    return;
  }

  if (ip.isPrivate(publicIpAddress)) {
    return publicIpAddress;
  }

  if (ip.isV6Format(publicIpAddress)) {
    publicIpAddress = ip.subnet(publicIpAddress, 64).networkAddress;
  }

  return publicIpAddress;
};

module.exports = { getPublicIpAddress };
