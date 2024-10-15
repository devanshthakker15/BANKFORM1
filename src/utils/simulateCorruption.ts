export const simulateCorruption = (data: any) => {
    // Create a shallow copy of the data
    const corruptedData = { ...data };
    
    // Get keys of the data
    const keys = Object.keys(corruptedData);
  
    // Randomly remove up to 2 keys from the data to simulate corruption
    const numKeysToRemove = Math.floor(Math.random() * Math.min(2, keys.length)) + 1;
    for (let i = 0; i < numKeysToRemove; i++) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      delete corruptedData[randomKey];
    }
    
    return corruptedData;
  };
  