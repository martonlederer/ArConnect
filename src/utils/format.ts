import BigNumber from "bignumber.js";

/**
 * Get app URL from any link
 *
 * @param link Link to get the app url from
 */
export function getAppURL(link: string) {
  if (!link) return "";

  const url = new URL(link);

  return url.host;
}

/**
 * Get community url formatted
 *
 * @param link Link to get the app url from
 */
export function getCommunityUrl(link: string) {
  if (!link) return "";

  const url = new URL(link);

  return url.hostname + ((url.pathname !== "/" && url.pathname) || "");
}

/**
 * Beautify addresses
 *
 * @param address Address to beautify
 *
 * @returns Formatted address
 */
export function formatAddress(address: string, count = 13) {
  return (
    address.substring(0, count) +
    "..." +
    address.substring(address.length - count, address.length)
  );
}

/**
 * Returns if a string is a valid Arweave address or ID
 *
 * This does not throw an error if the input is not a valid
 * address, unlike the "isAddress" assertion, in the assertion
 * utils.
 *
 * @param addr String to validate
 * @returns Valid address or not
 */
export const isAddressFormat = (addr: string) => /^[a-z0-9_-]{43}$/i.test(addr);

/**
 * Capitalizes first letters of settings name and replaces "_" with " "
 *
 * @param name String to format
 * @returns Formatted name
 */
export const formatSettingName = (name: string) => {
  if (!name) return "";

  if (name === "arconfetti") {
    return "ArConfetti";
  }

  if (name === "ao_support") {
    return "ao support";
  }

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Format balance into a more readable format, using M, B, T, Q, Qi, and S for millions, billions, trillions, quadrillions, quintillions, and sextillions respectively.
 *
 * @param balance The bignumber balance value to format.
 * @returns An object containing displayBalance, tooltipBalance and showTooltip
 */
export function formatBalance(balance: BigNumber) {
  let displayBalance: string;
  let showTooltip = false;

  const tooltipBalance = balance
    .toFormat(20, BigNumber.ROUND_FLOOR)
    .replace(/\.?0*$/, "");

  if (balance.lte(1e4)) {
    displayBalance = BigNumber(balance.toPrecision(6, BigNumber.ROUND_FLOOR))
      .toFixed(20, BigNumber.ROUND_FLOOR)
      .replace(/\.?0*$/, "");
    showTooltip = !balance.eq(displayBalance);
  } else if (balance.lt(1e6)) {
    displayBalance = BigNumber(balance.toPrecision(8, BigNumber.ROUND_FLOOR))
      .toFixed(20, BigNumber.ROUND_FLOOR)
      .replace(/\.?0*$/, "");
    showTooltip = !balance.eq(displayBalance);
  } else {
    showTooltip = true;
    let suffix = "";
    let divisor = 1;

    if (balance.gte(1e21)) {
      // Sextillions
      suffix = "S";
      divisor = 1e21;
    } else if (balance.gte(1e18)) {
      // Quintillions
      suffix = "Qi";
      divisor = 1e18;
    } else if (balance.gte(1e15)) {
      // Quadrillions
      suffix = "Q";
      divisor = 1e15;
    } else if (balance.gte(1e12)) {
      // Trillions
      suffix = "T";
      divisor = 1e12;
    } else if (balance.gte(1e9)) {
      // Billions
      suffix = "B";
      divisor = 1e9;
    } else if (balance.gte(1e6)) {
      // Millions
      suffix = "M";
      divisor = 1e6;
    }

    displayBalance =
      BigNumber(
        balance.dividedBy(divisor).toPrecision(6, BigNumber.ROUND_FLOOR)
      )
        .toFixed(20, BigNumber.ROUND_FLOOR)
        .replace(/\.?0*$/, "") + suffix;
  }

  return { displayBalance, tooltipBalance, showTooltip };
}
