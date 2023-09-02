const ipaddr = require('ipaddr.js');

/**
 * Get client's network address
 *
 * @param {IncomingMessage} req - Request from the client
 * @return {string} Network address
 *
 * @example
 *
 *     getNetworkAddress(req)
 */
const getNetworkAddress = (req) => {
  const remoteAddress =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!remoteAddress) {
    return;
  }

  const networkAddress = getFullIpAddress(req).split(':').slice(0, 4).join(':');

  return networkAddress;
};

/**
 * Get client's full IP address
 *
 * @param {IncomingMessage} req - Request from the client
 * @return {string} Full IP address
 *
 * @example
 *
 *     getFullIpAddress(remoteAddress)
 */
function getFullIpAddress(req) {
  const remoteAddress =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!remoteAddress) {
    return;
  }

  let fullIpAddress = remoteAddress;

  if (ipaddr.isValid(fullIpAddress)) {
    const addr = ipaddr.parse(fullIpAddress);

    // Handle IPv4-mapped IPv6
    if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
      fullIpAddress = addr.toIPv4Address().toString();
    }

    // Handle normal IPv6
    else if (addr.kind() === 'ipv6') {
      fullIpAddress = addr.toNormalizedString();
    }
  }

  return fullIpAddress;
}

module.exports = { getNetworkAddress, getFullIpAddress };
