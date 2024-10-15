// simulateCorruption.ts
export const simulateCorruption = (data: any[]) => {
  if (data.length === 0) return data;

  const corruptedData = [...data];
  const randomIndex = Math.floor(Math.random() * corruptedData.length);

  // Corrupt random fields or remove an entire entry
  if (Math.random() > 0.5) {
    delete corruptedData[randomIndex].accountHolderName;
  } else {
    corruptedData.splice(randomIndex, 1);
  }

  return corruptedData;
};
