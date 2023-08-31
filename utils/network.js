const ipaddr = require('ipaddr.js');

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

  if (ipaddr.isValid(publicIpAddress)) {
    const addr = ipaddr.parse(publicIpAddress);

    // Handle IPv4-mapped IPv6
    if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
      publicIpAddress = addr.toIPv4Address().toString();
    }

    // Handle normal IPv6
    else if (addr.kind() === 'ipv6') {
      publicIpAddress = addr
        .toNormalizedString()
        .split(':')
        .slice(0, 4)
        .join(':');
    }
  }

  return publicIpAddress;
};

module.exports = { getPublicIpAddress };
