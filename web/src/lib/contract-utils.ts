/**
 * Contract Utilities
 * Helper functions for contract interactions
 */

// STX Conversion
export const stxToMicroStx = (stx: number): number => {
  return Math.floor(stx * 1_000_000);
};

export const microStxToStx = (microStx: number): number => {
  return microStx / 1_000_000;
};

// Amount Formatting
export const formatStxAmount = (microStx: number): string => {
  const stx = microStxToStx(microStx);
  return stx.toFixed(6).replace(/\.?0+$/, '');
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

// Odds Calculation
export const calculateOdds = (amount: number, total: number): number => {
  if (total === 0) return 0;
  return (amount / total) * 100;
};

// Winnings Calculation
export const calculatePotentialWinnings = (
  betAmount: number,
  userBet: number,
  totalBet: number,
  poolTotal: number
): number => {
  if (totalBet === 0 || poolTotal === 0) return 0;
  const userShare = (userBet / totalBet) * poolTotal;
  return userShare;
};

export const calculateProfitLoss = (
  betAmount: number,
  winnings: number
): number => {
  return winnings - betAmount;
};

// Validation
export const validateStxAmount = (amount: number, minimum: number = 0): boolean => {
  return amount > 0 && amount >= minimum;
};

export const validateAddress = (address: string): boolean => {
  return /^SP[0-9A-Z]{32}$/.test(address) || /^SM[0-9A-Z]{32}$/.test(address);
};
