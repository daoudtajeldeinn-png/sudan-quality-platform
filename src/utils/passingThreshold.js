export const QUALITY_SYSTEM_UNITS = ['capa', 'iso-9001', 'qc-lab', 'ipqc'];

export const getPassingThreshold = (unitId) => {
  if (unitId === 'adv-iso-17025' || QUALITY_SYSTEM_UNITS.includes(unitId)) {
    return 80;
  }
  return 90;
};
