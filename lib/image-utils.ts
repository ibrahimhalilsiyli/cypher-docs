/**
 * Resizes and compresses an image file to a Base64 string.
 * This is crucial for localStorage-based apps to avoid hitting quota limits.
 */
export const resizeImage = (file: File, maxWidth: number = 800): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target?.result as string;
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let width = img.width;
				let height = img.height;

				if (width > maxWidth) {
					height = (height * maxWidth) / width;
					width = maxWidth;
				}

				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(new Error("Could not get canvas context"));
					return;
				}

				ctx.drawImage(img, 0, 0, width, height);

				// Compress to JPEG with 0.7 quality to save space
				resolve(canvas.toDataURL("image/jpeg", 0.7));
			};
			img.onerror = (err) => reject(err);
		};
		reader.onerror = (err) => reject(err);
	});
};
