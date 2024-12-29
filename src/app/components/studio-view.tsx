"use client";

import { Suspense, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "@/components/CopyButton";
import { ReloadButton } from "@/components/ReloadButton";
import { ShareButton } from "@/components/share-button";
import { type HistoryEntry, useStudio } from "@/providers/studio-provider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VersionSwitcher } from "./version-switcher";
import { NewButton } from "./new-button";
import { PromptInput } from "./prompt-input";
import { OptionsButton } from "./options-button";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AppLogo from "@/components/AppLogo";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function StudioView() {
	return (
		<Suspense>
			<HomeContent />
		</Suspense>
	);
}

function HomeContent() {
	const searchParams = useSearchParams();
	const {
		history,
		historyIndex,
		navigateHistory,
		currentHtml,
		isOverlayOpen,
		setIsOverlayOpen,
		getFormattedOutput,
		iframeRef,
		setHistory,
		setHistoryIndex,
		setCurrentHtml,
		setMode,
		sessionId,
		setStudioMode,
		isApplying,
		isGenerating,
	} = useStudio();
	const { resolvedTheme } = useTheme();
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(currentHtml || "");

	useEffect(() => {
		setEditContent(currentHtml || "");
	}, [currentHtml]);

	useEffect(() => {
		const source = searchParams.get("source");
		if (source) {
			const loadSourceVersion = async () => {
				try {
					const response = await fetch(`/api/apps/${source}`);
					if (!response.ok) {
						throw new Error("Failed to load source version");
					}

					let html = "";
					let signature = "";
					const content = await response.text();
					if (content.startsWith("{")) {
						const json = JSON.parse(content);
						html = json.html;
						signature = json.signature;
					} else {
						html = content;
						throw new Error("This pre-release version is not supported");
					}
					const newEntry: HistoryEntry = {
						html,
						feedback: "",
						sessionId,
						version: "1",
						signature,
					};
					setHistory([newEntry]);
					setHistoryIndex(0);
					setCurrentHtml(html);
					setMode("feedback");
					setStudioMode(true);
				} catch (error) {
					console.error("Error loading source version:", error);
					toast.error("Failed to load source version");
				}
			};
			loadSourceVersion();
		}
	}, [
		searchParams,
		sessionId,
		setCurrentHtml,
		setHistory,
		setHistoryIndex,
		setMode,
		setStudioMode,
	]);

	const handleSaveEdit = () => {
		setCurrentHtml(editContent);
		setIsEditing(false);
		toast.success("Code updated successfully!");
	};

	return (
		<main className="h-screen flex flex-col overflow-hidden">
			{/* Top Input Bar */}
			<div className="p-4 bg-background border-b flex-shrink-0">
				<div className="flex flex-col gap-4">
					{/* Version Switcher - Separate row on mobile */}
					<div className="flex justify-center lg:hidden">
						<NewButton />
						<VersionSwitcher
							className="lg:hidden justify-center flex-1"
							currentVersion={historyIndex + 1}
							totalVersions={history.length}
							onPrevious={() => navigateHistory("prev")}
							onNext={() => navigateHistory("next")}
						/>
						<OptionsButton />
					</div>

					{/* Main Input Row */}
					<div className="flex items-center gap-4">
						<NewButton className="hidden lg:flex" />
						<VersionSwitcher
							className="lg:flex hidden"
							currentVersion={historyIndex + 1}
							totalVersions={history.length}
							onPrevious={() => navigateHistory("prev")}
							onNext={() => navigateHistory("next")}
						/>
						<PromptInput />
						<OptionsButton className="hidden lg:flex" />
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Column - Code View */}
				<div className="w-1/2 p-4 border-r overflow-auto lg:block hidden">
					<div className="relative h-full">
						<SyntaxHighlighter
							language="html"
							style={resolvedTheme === "dark" ? vscDarkPlus : vs}
							className="h-full rounded"
							customStyle={{ margin: 0, height: "100%", width: "100%" }}
						>
							{currentHtml || "<!-- HTML preview will appear here -->"}
						</SyntaxHighlighter>
						<div className="absolute bottom-6 right-6 flex gap-2">
							<CopyButton code={currentHtml} />
							<Button
								onClick={() => setIsEditing(true)}
								className="bg-black text-white dark:hover:bg-gray-700"
							>
								Edit
							</Button>
						</div>
					</div>
				</div>

				{/* Right Column - Preview */}
				<div className="lg:w-1/2 w-full overflow-hidden">
					<div className="h-full p-4 relative">
						<iframe
							title="Studio Preview"
							ref={iframeRef}
							srcDoc={`<style>body{background-color:${resolvedTheme === "dark" ? "rgb(30 30 30)" : "#ffffff"};margin:0;}</style>${currentHtml}`}
							className="w-full h-full border rounded bg-background shadow-sm"
							style={{ minHeight: "100%", minWidth: "100%", overflow: "auto" }}
						/>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			{isEditing && (
				<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
					<div className="bg-black p-4 rounded w-3/4 text-white">
						<h2 className="text-lg font-bold mb-4">Edit Code</h2>
						<textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className="w-full h-64 border p-2 rounded bg-zinc-900 text-white"
						/>
						<div className="flex justify-end gap-2 mt-4">
							<Button
								onClick={() => setIsEditing(false)}
								variant="secondary"
								className="bg-gray-600 text-white hover:bg-gray-500"
							>
								Cancel
							</Button>
							<Button
								onClick={handleSaveEdit}
								className="bg-blue-600 text-white hover:bg-blue-500"
							>
								Save
							</Button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
