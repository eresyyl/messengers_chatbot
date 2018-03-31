module.exports = (string, length = 80) => {
	return (string.length < length) ? string : `${string.substring(0, 77)}...`;
}