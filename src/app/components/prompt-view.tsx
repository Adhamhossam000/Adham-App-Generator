import AppLogo from "@/components/AppLogo";
import { MicrophoneButton } from "@/components/MicrophoneButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudio } from "@/providers/studio-provider";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { useState } from "react";
import { APP_EXAMPLES } from "@/data/app-examples";
import { Info, Pencil } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { GalleryListing } from "./gallery-listing";
import { MAINTENANCE_GENERATION } from "@/lib/settings";

const APP_SUGGESTIONS = APP_EXAMPLES.map((example) => example.label);

export default function PromptView() {
	const {
		setStudioMode,
		query,
		setQuery,
		setTriggerGeneration,
		drawingData,
		setDrawingData,
	} = useStudio();
	const [showDrawing, setShowDrawing] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim() && !drawingData) {
			toast.error("Describe your app or draw it!");
			return;
		}
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	const handleDrawingComplete = async (imageData: string) => {
		setDrawingData(imageData);
		setShowDrawing(false);
	};

	const handleSuggestionClick = (suggestion: string) => () => {
		const example = APP_EXAMPLES.find((ex) => ex.label === suggestion);
		setQuery(example?.prompt || suggestion);
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	const handleTranscription = (transcription: string) => {
		setQuery(transcription);
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	return (
		<div className="flex flex-col gap-6 items-center justify-center  ">
			
			<h1 className="text-[2em] font-montserrat items-center justify-center pt-5">Adham Lab</h1>
			<div className="flex flex-col gap-3 items-center justify-center min-w-[30%] px-4 md:px-0 mt-20">
				<div>
					<h1 className="text-[2em] md:text-[3em] font-montserrat text-center">
						Build a micro-app
					</h1>
					<h2 className="text-[1.2em] md:text-[1.4em] font-montserrat mb-4 md:mb-8 text-center text-muted-foreground ">
						at speed of LIGHT
					</h2>
				</div>
				{MAINTENANCE_GENERATION && (
					<div className="text-center text-gray-500 flex items-center gap-2 border border-groq rounded-full p-4 my-4">
						<Info className="h-5 w-5" />
						{"We're currently undergoing maintenance. We'll be back soon!"}
					</div>
				)}
				<form
					className="flex row gap-2 items-center justify-center w-full border-border border-solid border-2 rounded-full p-2 focus-within:border-groq"
					onSubmit={handleSubmit}
				>
					<Input
						autoFocus
						disabled={MAINTENANCE_GENERATION}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="flex-1 w-full border-0 md:text-lg p-3 bg-transparent shadow-none focus:outline-none focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
						placeholder="Describe your app..."
					/>
					<Button
						disabled={MAINTENANCE_GENERATION}
						type="button"
						variant="ghost"
						size="icon"
						className={`rounded-full relative z-10 shrink-0 flex items-center justify-center px-3 ${
							drawingData ? "min-w-[80px]" : "min-w-[40px]"
						}`}
						onClick={() => setShowDrawing(true)}
					>
						{drawingData ? (
							<div className="flex items-center gap-1.5">
								<Pencil className="h-4 w-4" />
								<span className="text-sm ">Edit</span>
							</div>
						) : (
							<Pencil className="h-5 w-5" />
						)}
					</Button>
					<MicrophoneButton
						onTranscription={handleTranscription}
						disabled={MAINTENANCE_GENERATION}
					/>
					<Button
						className="rounded-full"
						type="submit"
						disabled={MAINTENANCE_GENERATION}
					>
						Create
					</Button>
				</form>
			</div>
			{showDrawing && (
				<DrawingCanvas
					onDrawingComplete={handleDrawingComplete}
					onClose={() => setShowDrawing(false)}
				/>
			)}
			<div className="flex  flex-wrap justify-center gap-3 items-center w-[90%] md:w-[60%] lg:w-[50%] pb-4 px-2 ">
				{APP_SUGGESTIONS.map((suggestion) => (
					<Button
						disabled={MAINTENANCE_GENERATION}
						key={suggestion}
						variant="outline"
						className="rounded-full text-xs whitespace-nowrap shrink-0"
						onClick={handleSuggestionClick(suggestion)}
					>
						{suggestion}
					</Button>
				))}
			</div>
			
		</div>
	);
}
