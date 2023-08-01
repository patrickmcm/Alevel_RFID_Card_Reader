const nonceStore = new Set();

function isValidNonce(nonce: string) {
    if (nonceStore.has(nonce)) {
      return false; // Nonce already seen before
    }
    // Add the nonce to the store and set an expiration time 
    nonceStore.add(nonce);
    setTimeout(() => {
      nonceStore.delete(nonce); // Remove the nonce after expiration
    }, 30000); // 30 seconds
    return true;
}

export {
    isValidNonce
}