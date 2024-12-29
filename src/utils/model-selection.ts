export function getFallbackModel(): string {
	// Randomly choose between versatile models
	return Math.random() < 0.5
		? "llama-3.3-70b-versatile"
		: "llama-3.1-70b-versatile";
}

export const PRIMARY_MODEL = "llama-3.3-70b-specdec";
export const VANILLA_MODEL = "llama-3.3-70b-versatile";

export const PRIMARY_VISION_MODEL = "llama-3.2-90b-vision-preview";
export const FALLBACK_VISION_MODEL = "llama-3.2-11b-vision-preview";
