export function getCentralMeridianMars(T: number): number {
    const lambda0 = 352.9065 + 1.1733 * T;
    const beta0 = 63.2818 - 0.00394 * T;

    console.log(lambda0, beta0);

    const t = 0.005028; // TODO light time

    const rightAscension0 = 316.55 + 0.00675 * (T - 1905);
    const declination0 = 52.85 + 0.00347 * (T - 1950);

    console.log(rightAscension0, declination0);
    const JDE = 0;
    // const t = 0; // Light time

    const delta0Rad = 0.0;
    const deltaRad = 0.0;
    const alpha0Rad = 0.0;
    const alphaRad = 0.0;

    const W = 11.504 + 350.89200025* (JDE - t - 2433282.5);

    console.log(W);

    const term1 = Math.sin(delta0Rad) * Math.cos(deltaRad) * Math.cos(alpha0Rad - alphaRad)
        - Math.sin(deltaRad) * Math.cos(delta0Rad);
    const term2 = Math.cos(deltaRad) * Math.sin(alpha0Rad - alphaRad);
    const zeta = Math.atan2(term1, term2);

    const omega = W - zeta;

}
