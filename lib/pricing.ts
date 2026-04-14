export interface PriceParams {
  basePrice: number;
  isPeak: boolean;
  peakPremium: number;
  racketCount: number;
  racketPriceWithBalls: number;
  boughtBallsOnly: boolean;
  ballsOnlyPrice: number;
  needsLighting: boolean;
  lightingPrice: number;
}

export interface PriceBreakdown {
  base: number;
  peakSurcharge: number;
  rackets: number;
  ballsOnly: number;
  lighting: number;
  total: number;
}

/**
 * Pure pricing calculator — always run server-side on booking creation.
 * Client-side usage is only for live display.
 */
export function calculatePrice(params: PriceParams): PriceBreakdown {
  const {
    basePrice,
    isPeak,
    peakPremium,
    racketCount,
    racketPriceWithBalls,
    boughtBallsOnly,
    ballsOnlyPrice,
    needsLighting,
    lightingPrice,
  } = params;

  const base = basePrice;
  const peakSurcharge = isPeak ? peakPremium : 0;
  const rackets = racketCount * racketPriceWithBalls;
  // balls only is only applicable when racketCount === 0
  const ballsOnly = racketCount === 0 && boughtBallsOnly ? ballsOnlyPrice : 0;
  const lighting = needsLighting ? lightingPrice : 0;

  const total = base + peakSurcharge + rackets + ballsOnly + lighting;

  return { base, peakSurcharge, rackets, ballsOnly, lighting, total };
}

/** Generate a random 4-5 digit PIN string */
export function generateBookingPin(): string {
  const length = Math.random() < 0.5 ? 4 : 5;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
