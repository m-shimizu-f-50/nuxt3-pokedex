// グラフの上限値に対するパーセントを返す
export const calculatePercentage = (value: number, max: number = 255) => {
	return (value / max) * 100;
};
