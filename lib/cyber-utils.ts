export const safeDecode = (input: string, type: 'base64' | 'hex' | 'url'): string => {
	try {
		if (!input) return "";

		switch (type) {
			case 'base64':
				return atob(input);
			case 'hex':
				let str = '';
				for (let i = 0; i < input.length; i += 2) {
					str += String.fromCharCode(parseInt(input.substr(i, 2), 16));
				}
				return str;
			case 'url':
				return decodeURIComponent(input);
			default:
				return input;
		}
	} catch (e) {
		return "Decoding Error";
	}
};

export const getWordCount = (text: string): number => {
	return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};
