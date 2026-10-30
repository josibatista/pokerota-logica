export function obterFaseDaRota(location) {
    const visitante = location?.state?.visitante === true;

    return location?.state?.fase ?? (visitante ? 1 : null);
}
