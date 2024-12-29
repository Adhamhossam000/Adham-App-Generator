import { Button } from "@/components/ui/button";
import { useStudio } from "@/providers/studio-provider";

export function SubmitButton() {
	const {
		mode,
		query,
		isGenerating,
		isApplying,
		generateHtml,
		submitFeedback,
	} = useStudio();
	return (
		<Button
			disabled={
				(mode === "query" && (!query.trim() || isGenerating)) ||
				(mode === "feedback" && isApplying)
			}
			className={`bg-groq text-groq-foreground transition-all duration-200 rounded-full ${
				isGenerating || isApplying
					? "loading-animation"
					: "bg-[#F55036] hover:bg-[#D93D26]"
			}`}
			onClick={mode === "query" ? generateHtml : submitFeedback}
		>
			{mode === "query"
				? isGenerating
					? "Generating..."
					: "Generate"
				: isApplying
					? "Applying..."
					: "Apply Edit"}
		</Button>
	);
}
